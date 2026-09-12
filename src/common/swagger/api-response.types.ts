import type { Type } from "@nestjs/common";

export interface SuccessResponseOptions {
  type: Type<unknown>;
  status: number;
  description: string;
  isArray?: boolean;
}

export interface ErrorResponseOptions {
  description: string;
  status: number;
}
