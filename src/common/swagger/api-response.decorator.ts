import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
  ApiValidationErrorResponseDto,
} from "./api-response.dto.ts";

type SuccessResponseOptions = {
  type: Type<unknown>;
  status: number;
  description: string;
  isArray?: boolean;
};

export function ApiSuccessResponse(options: SuccessResponseOptions) {
  const { description, isArray = false, status, type } = options;

  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, type),
    ApiResponse({
      status,
      description,
      schema: {
        type: "object",
        required: ["code", "msg", "data"],
        properties: {
          code: {
            type: "number",
            description: "业务状态码；0 表示成功",
            example: 0,
          },
          msg: {
            type: "string",
            description: "响应消息",
            example: "success",
          },
          data: isArray
            ? { type: "array", items: { $ref: getSchemaPath(type) } }
            : { $ref: getSchemaPath(type) },
        },
      },
    }),
  );
}

export function ApiNotFoundErrorResponse(description = "资源不存在") {
  return ApiErrorResponse({ status: 404, description });
}

export function ApiErrorResponse({
  description,
  status,
}: {
  description: string;
  status: number;
}) {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ApiResponse({ status, description, type: ApiErrorResponseDto }),
  );
}

export function ApiValidationErrorResponse() {
  return applyDecorators(
    ApiExtraModels(ApiValidationErrorResponseDto),
    ApiUnprocessableEntityResponse({
      description: "请求参数校验失败",
      type: ApiValidationErrorResponseDto,
    }),
  );
}
