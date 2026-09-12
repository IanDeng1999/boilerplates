/** 单次 PUT 上限 5 GiB，超过需走分片上传 */
export const MAX_UPLOAD_SIZE = 5 * 1024 ** 3;

/** 预签名上传地址有效期（秒） */
export const UPLOAD_URL_EXPIRES_IN = 900;
