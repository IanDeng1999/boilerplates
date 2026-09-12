/** 单次 PUT 上限 5 GiB，超过需走分片上传 */
export const MAX_UPLOAD_SIZE = 5 * 1024 ** 3;

/** 单次批量获取上传地址的文件数量上限 */
export const MAX_UPLOAD_BATCH_SIZE = 20;

/** 预签名上传地址有效期（秒） */
export const UPLOAD_URL_EXPIRES_IN = 900;
