import { basename } from "node:path";
import {
  EntityManager,
  EntityRepository,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OssService } from "../../infra/oss/oss.service.ts";
import { Account } from "../auth/entities/account.entity.ts";
import { ALLOWED_EXTENSION_SET, UPLOAD_URL_EXPIRES_IN } from "./asset.const.ts";
import { AssetUploadResponseDto } from "./dto/asset-upload-response.dto.ts";
import {
  CreateAssetUploadDto,
  CreateAssetUploadsDto,
} from "./dto/create-asset-upload.dto.ts";
import { OssUploadCallbackDto } from "./dto/oss-upload-callback.dto.ts";
import { Asset, AssetKind, AssetStatus } from "./entities/asset.entity.ts";

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: EntityRepository<Asset>,
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
    private readonly ossService: OssService,
  ) {}

  /**
   * 批量发放预签名上传地址（PUT），返回顺序与请求一致。
   * 同 sha256 视为同一份内容（内容寻址，size 由内容决定）：首条落库，后续条目查到同一条记录，
   * 复用同一 key，不会重复占用存储。
   */
  async createUploadUrls(
    dto: CreateAssetUploadsDto,
    uploaderId: string,
  ): Promise<AssetUploadResponseDto[]> {
    // 串行处理：共用一个 EntityManager，逐条 await 保证 flush 顺序，
    // 也让同批重复内容直接命中上一条刚落库的记录，而不是靠唯一约束冲突回退
    const results: AssetUploadResponseDto[] = [];

    for (const item of dto.items) {
      const sha256 = item.sha256.toLowerCase();
      const existing = await this.findByContent(sha256);
      const asset =
        existing ?? (await this.createAsset(item, sha256, uploaderId));

      results.push({
        assetId: asset.id,
        bucket: asset.bucket,
        key: asset.key,
        uploadUrl: await this.ossService.getUploadUrl({
          key: asset.key,
          contentType: asset.mimeType,
          contentLength: Number(asset.size),
          sha256,
          expiresIn: UPLOAD_URL_EXPIRES_IN,
        }),
        headers: {
          "Content-Type": asset.mimeType,
          // 参与签名，必须原样回传
          "x-amz-checksum-sha256": this.ossService.sha256HexToBase64(sha256),
        },
        expiresIn: UPLOAD_URL_EXPIRES_IN,
        // 命中的可能是库里已有的，也可能是本批上一条刚建的，两者都无需再传
        existed: Boolean(existing),
      });
    }

    return results;
  }

  /**
   * 处理 OSS 对象创建事件：按对象 key 反查资产，把 pending 流转为 ready。
   * 预签名 PUT 已对 ContentLength 与 x-amz-checksum-sha256 签名，OSS 收包时即校验，
   * 能收到 ObjectCreated 就说明对象已按声明落盘，无需再 HeadObject 回源。
   * 幂等，已 ready 的资产不重复处理；非本 bucket、非 ObjectCreated 或 key 未登记
   * （不是本服务产生的对象）的记录直接忽略。
   */
  async handleUploadCallback(event: OssUploadCallbackDto) {
    const bucket = this.configService.getOrThrow<string>("OSS_BUCKET");

    const keys = new Set<string>();
    for (const record of event.Records) {
      if (!record.eventName.startsWith("s3:ObjectCreated:")) continue;
      if (record.s3.bucket.name !== bucket) continue;
      // 事件里的 key 是 URL 编码的（uploads%2F...），需还原；未编码的原文解码后不变
      keys.add(decodeURIComponent(record.s3.object.key));
    }

    if (keys.size === 0) return true;

    // 一条 UPDATE 完成本批流转，不先把记录查出来：本次转没转成功无所谓，
    // 事件是至少一次投递，已 ready 的重投在这里自然不更新
    await this.em.nativeUpdate(
      Asset,
      { key: { $in: [...keys] }, status: AssetStatus.Pending },
      { status: AssetStatus.Ready },
    );

    return true;
  }

  /** 内容标识就是 sha256（同 hash 同内容，size 由内容决定，无需参与匹配） */
  private findByContent(sha256: string) {
    return this.assetRepository.findOne({ sha256 });
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
    // DTO 已拦一道，这里兜底，保证任何调用入口都不会落库白名单外的扩展名
    if (!ext || !ALLOWED_EXTENSION_SET.has(ext)) {
      throw new BadRequestException(`不支持的扩展名：${ext ?? dto.name}`);
    }
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
        const existing = await this.findByContent(sha256);
        if (existing) {
          return existing;
        }
      }
      throw error;
    }
  }
}
