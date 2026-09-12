import { basename, extname } from "node:path";
import {
  EntityManager,
  EntityRepository,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v7 as uuidv7 } from "uuid";
import { OssService } from "../../infra/oss/oss.service.ts";
import { Account } from "../auth/entities/account.entity.ts";
import { AssetUploadResponseDto } from "./dto/asset-upload-response.dto.ts";
import { CreateAssetUploadDto } from "./dto/create-asset-upload.dto.ts";
import { Asset, AssetKind } from "./entities/asset.entity.ts";
import { UPLOAD_URL_EXPIRES_IN } from "./types/asset.type.ts";

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
   * 发放预签名上传地址（PUT）。
   * 同 sha256 + size 视为同一份内容，复用已有记录与 key，避免重复占用存储。
   */
  async createUploadUrl(
    dto: CreateAssetUploadDto,
    uploaderId: string,
  ): Promise<AssetUploadResponseDto> {
    const sha256 = dto.sha256.toLowerCase();
    const existed = await this.findByContent(sha256, dto.size);
    const asset = existed ?? (await this.createAsset(dto, sha256, uploaderId));

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
      existed: Boolean(existed),
    };
  }

  private findByContent(sha256: string, size: number) {
    return this.assetRepository.findOne({ sha256, size });
  }

  private async createAsset(
    dto: CreateAssetUploadDto,
    sha256: string,
    uploaderId: string,
  ) {
    const asset = this.assetRepository.create({
      bucket: this.configService.getOrThrow("OSS_BUCKET"),
      key: buildObjectKey(dto.name, dto.mimeType),
      name: basename(dto.name),
      ext: resolveExt(dto.name),
      mimeType: dto.mimeType,
      kind: resolveKind(dto.mimeType),
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

function resolveKind(mimeType: string): AssetKind {
  const [type] = mimeType.split("/");
  if (type === "image") return AssetKind.Image;
  if (type === "video") return AssetKind.Video;
  if (type === "audio") return AssetKind.Audio;
  return AssetKind.File;
}

function resolveExt(name: string) {
  const ext = extname(basename(name)).slice(1).toLowerCase();
  return /^[a-z0-9]{1,10}$/.test(ext) ? ext : undefined;
}

function buildObjectKey(name: string, mimeType: string) {
  const now = new Date();
  const month = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const ext = resolveExt(name);
  return `asset/${resolveKind(mimeType)}/${month}/${uuidv7()}${ext ? `.${ext}` : ""}`;
}
