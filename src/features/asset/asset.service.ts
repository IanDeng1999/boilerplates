import { basename } from "node:path";
import {
  EntityManager,
  EntityRepository,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OssService } from "../../infra/oss/oss.service.ts";
import { Account } from "../auth/entities/account.entity.ts";
import { AssetStatusResponseDto } from "./dto/asset-status-response.dto.ts";
import { AssetUploadResponseDto } from "./dto/asset-upload-response.dto.ts";
import {
  CreateAssetUploadDto,
  CreateAssetUploadsDto,
} from "./dto/create-asset-upload.dto.ts";
import { OssUploadCallbackDto } from "./dto/oss-upload-callback.dto.ts";
import { Asset, AssetKind, AssetStatus } from "./entities/asset.entity.ts";
import { UPLOAD_URL_EXPIRES_IN } from "./types/asset.type.ts";

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: EntityRepository<Asset>,
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
    private readonly ossService: OssService,
  ) {}

  /**
   * 批量发放预签名上传地址（PUT），返回顺序与请求一致。
   * 同 sha256 + size 视为同一份内容，复用已有记录与 key，避免重复占用存储。
   */
  async createUploadUrls(
    dto: CreateAssetUploadsDto,
    uploaderId: string,
  ): Promise<AssetUploadResponseDto[]> {
    // 同一批内重复内容只建一次记录，后续直接复用
    const resolved = new Map<string, AssetUploadResponseDto>();
    const results: AssetUploadResponseDto[] = [];

    for (const item of dto.items) {
      const sha256 = item.sha256.toLowerCase();
      const contentKey = `uploads/${sha256}:${item.size}`;
      const cached = resolved.get(contentKey);

      if (cached) {
        // 同批重复：key 与 uploadUrl 相同，客户端只需上传一次
        results.push({ ...cached, existed: true });
        continue;
      }

      const existing = await this.findByContent(sha256, item.size);
      const asset =
        existing ?? (await this.createAsset(item, sha256, uploaderId));
      const response = await this.buildUploadResponse(
        asset,
        sha256,
        Boolean(existing),
      );
      resolved.set(contentKey, response);
      results.push(response);
    }

    return results;
  }

  /**
   * 处理 OSS 对象创建事件：按对象 key 反查资产，再以 HeadObject 为准
   * 将 pending 流转为 ready / failed。幂等，已 ready 的资产不重复回源。
   * 非本 bucket、非 ObjectCreated 或 key 未登记（不是本服务产生的对象）的记录直接忽略。
   */
  async handleUploadCallback(
    event: OssUploadCallbackDto,
  ): Promise<AssetStatusResponseDto[]> {
    const bucket = this.configService.getOrThrow<string>("OSS_BUCKET");

    const keys = new Set<string>();
    for (const record of event.Records) {
      if (!record.eventName.startsWith("s3:ObjectCreated:")) continue;
      if (record.s3.bucket.name !== bucket) continue;
      keys.add(record.s3.object.key);
    }

    if (keys.size === 0) return [];

    const assets = await this.assetRepository.find({
      key: { $in: [...keys] },
    });

    const results: AssetStatusResponseDto[] = [];
    for (const asset of assets) {
      results.push({
        assetId: asset.id,
        status: await this.syncUploadStatus(asset),
      });
    }

    await this.em.flush();
    return results;
  }

  private async syncUploadStatus(asset: Asset): Promise<AssetStatus> {
    if (asset.status === AssetStatus.Ready) {
      return asset.status;
    }

    const stat = await this.ossService.statObject(asset.key);
    if (!stat) {
      // 客户端可能还没传完，保持 pending 等下次回调
      return asset.status;
    }

    const sizeMatched = stat.contentLength === Number(asset.size);
    const checksumMatched =
      !stat.checksumSha256 ||
      !asset.sha256 ||
      stat.checksumSha256 === this.ossService.sha256HexToBase64(asset.sha256);
    if (sizeMatched && checksumMatched) {
      asset.status = AssetStatus.Ready;
    } else {
      asset.status = AssetStatus.Failed;
      this.logger.warn(
        {
          assetId: asset.id,
          key: asset.key,
          expectedSize: Number(asset.size),
          actualSize: stat.contentLength,
          checksumMatched,
        },
        "上传内容与声明不一致",
      );
    }

    return asset.status;
  }

  private async buildUploadResponse(
    asset: Asset,
    sha256: string,
    existed: boolean,
  ): Promise<AssetUploadResponseDto> {
    const uploadUrl = await this.ossService.getUploadUrl({
      key: asset.key,
      contentType: asset.mimeType,
      contentLength: Number(asset.size),
      sha256,
      expiresIn: UPLOAD_URL_EXPIRES_IN,
    });

    return {
      assetId: asset.id,
      bucket: asset.bucket,
      key: asset.key,
      uploadUrl,
      headers: {
        "Content-Type": asset.mimeType,
        // 参与签名，必须原样回传
        "x-amz-checksum-sha256": this.ossService.sha256HexToBase64(sha256),
      },
      expiresIn: UPLOAD_URL_EXPIRES_IN,
      existed,
    };
  }

  private findByContent(sha256: string, size: number) {
    return this.assetRepository.findOne({ sha256, size });
  }

  private resolveKind(mimeType: string): AssetKind {
    const [type] = mimeType.split("/");
    if (type === "image") return AssetKind.Image;
    if (type === "video") return AssetKind.Video;
    if (type === "audio") return AssetKind.Audio;
    return AssetKind.File;
  }

  private async createAsset(
    dto: CreateAssetUploadDto,
    sha256: string,
    uploaderId: string,
  ) {
    const ext = this.ossService.resolveExt(dto.name);
    const asset = this.assetRepository.create({
      bucket: this.configService.getOrThrow("OSS_BUCKET"),
      key: this.ossService.buildObjectKey(sha256, ext),
      name: basename(dto.name),
      ext,
      mimeType: dto.mimeType,
      kind: this.resolveKind(dto.mimeType),
      size: dto.size,
      sha256,
      uploader: this.em.getReference(Account, uploaderId),
    });
    this.em.persist(asset);

    try {
      await this.em.flush();
      return asset;
    } catch (error) {
      // 并发上传同内容文件时唯一约束会冲突，回退到已落库的记录
      if (error instanceof UniqueConstraintViolationException) {
        const existing = await this.findByContent(sha256, dto.size);
        if (existing) {
          return existing;
        }
      }
      throw error;
    }
  }
}
