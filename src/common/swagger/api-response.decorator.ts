import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiNotFoundResponse,
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
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponseDto) },
          {
            required: ["data"],
            properties: {
              data: isArray
                ? { type: "array", items: { $ref: getSchemaPath(type) } }
                : { $ref: getSchemaPath(type) },
            },
          },
        ],
      },
    }),
  );
}

export function ApiNotFoundErrorResponse(description = "资源不存在") {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ApiNotFoundResponse({ description, type: ApiErrorResponseDto }),
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
