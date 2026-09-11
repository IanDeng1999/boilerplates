import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OssService {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      endpoint: configService.getOrThrow("OSS_ENDPOINT"),
      // 任意值，S3 兼容存储不强制校验
      region: configService.getOrThrow("OSS_REGION"),
      credentials: {
        accessKeyId: configService.getOrThrow("OSS_ACCESS_KEY_ID"), // 访问密钥 ID
        secretAccessKey: configService.getOrThrow("OSS_SECRET_ACCESS_KEY"), // 秘密访问密钥
      },
      // 强制路径样式，对 MinIO 等自建服务必须设为 true
      forcePathStyle: true,
    });
  }

  sha256HexToBase64(hexSha256: string) {
    const buf = Buffer.from(hexSha256, "hex");
    return buf.toString("base64");
  }

  getUploadUrl({
    key,
    contentType,
    contentLength,
    metaData = {},
    sha256,
    expiresIn = 60, // 分钟
  }: {
    key: string;
    contentType: string;
    contentLength: number;
    metaData: Record<string, string>;
    sha256: string;
    expiresIn: number;
  }) {
    return getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: this.configService.get("OSS_BUCKET"),
        Key: key,
        ContentType: contentType,
        ContentLength: contentLength,
        Metadata: {
          ...metaData,
        },
        ChecksumAlgorithm: "SHA256",
        ChecksumSHA256: this.sha256HexToBase64(sha256),
      }),
      {
        expiresIn: expiresIn,
        unhoistableHeaders: new Set(["x-amz-checksum-sha256"]),
      },
    );
  }
  getDownloadUrl({
    key,
    expiresIn = 300, // 5分钟
  }: {
    key: string;
    expiresIn: number;
  }) {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.configService.getOrThrow("OSS_BUCKET"),
        Key: key,
      }),
      { expiresIn },
    );
  }
}
