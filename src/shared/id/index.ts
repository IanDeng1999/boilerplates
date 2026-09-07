import { Snowflake, TwitterSnowflake } from "@sapphire/snowflake";
import { ConfigManager } from "../config";

export const snowflakeId = new Snowflake(
  new Date(ConfigManager.get("SNOWFLAKE_EPOCH")),
);

export function genSnowflakeId(isString: true): string;
export function genSnowflakeId(isString: false): bigint;
export function genSnowflakeId(isString: boolean = false) {
  if (isString) return snowflakeId.generate().toString();
  return snowflakeId.generate();
}

export function genTwitterSnowflakeId(isString: true): string;
export function genTwitterSnowflakeId(isString: false): bigint;
export function genTwitterSnowflakeId(isString = false) {
  if (isString) return TwitterSnowflake.generate().toString();
  return TwitterSnowflake.generate();
}
