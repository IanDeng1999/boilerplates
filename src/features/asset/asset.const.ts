/** 允许上传的图片扩展名 */
export const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "bmp",
  "heic",
  "heif",
  "tif",
  "tiff",
] as const;

/** 允许上传的视频扩展名 */
export const VIDEO_EXTENSIONS = [
  "mp4",
  "m4v",
  "mov",
  "webm",
  "mkv",
  "avi",
  "3gp",
  "mpeg",
  "mpg",
] as const;

/** 允许上传的扩展名白名单：当前仅图片与视频 */
export const ALLOWED_EXTENSIONS = [
  ...IMAGE_EXTENSIONS,
  ...VIDEO_EXTENSIONS,
] as const;

/** 允许的扩展名集合，供运行时判断（服务层兜底校验） */
export const ALLOWED_EXTENSION_SET: ReadonlySet<string> = new Set(
  ALLOWED_EXTENSIONS,
);

/** 文件名必须以白名单内的扩展名结尾（大小写不敏感） */
export const ALLOWED_EXTENSION_PATTERN = new RegExp(
  `\\.(${ALLOWED_EXTENSIONS.join("|")})$`,
  "i",
);

/** MIME 只允许 image/* 与 video/* */
export const ALLOWED_MIME_TYPE_PATTERN = /^(image|video)\/[a-z0-9.+-]+$/i;

/** 单次 PUT 上限 5 GiB，超过需走分片上传 */
export const MAX_UPLOAD_SIZE = 5 * 1024 ** 3;

/** 单次批量获取上传地址的文件数量上限 */
export const MAX_UPLOAD_BATCH_SIZE = 10;

/** 预签名上传地址有效期（秒） */
export const UPLOAD_URL_EXPIRES_IN = 900;
