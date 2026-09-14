import { basename, extname } from "node:path";
import {
  GetObjectCommand,
  HeadBucketCommand,
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

  /** 提取安全扩展名：取小写扩展名，仅接受 [a-z0-9]{1,10}，否则返回 undefined */
  resolveExt(name: string): string | undefined {
    const ext = extname(basename(name)).slice(1).toLowerCase();
    return /^[a-z0-9]{1,10}$/.test(ext) ? ext : undefined;
  }

  /**
   * 把文件名转换为可直接用于对象 key 的安全形式：
   * 去掉目录、空白转下划线、非 [A-Za-z0-9._-] 字符（中文/特殊符号等）转下划线，
   * 压缩连续下划线、去除开头分隔符并限长。结果为空时回退为 file。
   */
  sanitizeFileName(name: string): string {
    const base = basename(name)
      .normalize("NFKD")
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^[._-]+/, "")
      .slice(0, 120);
    return base || "file";
  }

  /**
   * 按内容生成对象 key，不采用源文件名：uploads/yyyy-mm-dd/{sha256}.{ext}
   * 全 ASCII，同内容同 key，事件回调可直接匹配，无需转义。
   */
  buildObjectKey(sha256: string, ext?: string): string {
    const now = new Date();
    const date = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
    return `uploads/${date}/${sha256}${ext ? `.${ext}` : ""}`;
  }

  async checkConnectivity(signal: AbortSignal) {
    await this.s3.send(
      new HeadBucketCommand({
        Bucket: this.configService.getOrThrow("OSS_BUCKET"),
      }),
      { abortSignal: signal },
    );
  }

  /**
   * 查看文件信息：https://json2.cc/doc/file_info
   */
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
    metaData?: Record<string, string>;
    sha256: string;
    expiresIn: number;
  }) {
    return getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow("OSS_BUCKET"),
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
