import type { Type } from "@nestjs/common";

/**
 * 内置基础类型响应体，直接描述 data 本身，无需为单个布尔值造一个 DTO。
 * 取值与 JSON Schema 的 type 一致。
 */
export type PrimitiveResponseType = "string" | "number" | "boolean";

export interface SuccessResponseOptions {
  type: Type<unknown> | PrimitiveResponseType;
  status: number;
  description: string;
  isArray?: boolean;
}

export interface ErrorResponseOptions {
  description: string;
  status: number;
}
