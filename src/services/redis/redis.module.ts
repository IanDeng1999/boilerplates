import { Module, Provider } from "@nestjs/common";
import { Redis } from "ioredis";

export const REDIS_CLIENT = Symbol("REDIS_CLIENT");

export interface RedisModuleOptions {
  url?: string;
}

export interface RedisModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
  inject?: any[];
}

export interface RedisModuleOptionsProvider {
  createRedisOptions: () => Promise<RedisModuleOptions> | RedisModuleOptions;
}

// https://github.com/redis/ioredis
@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions = {}) {
    const redisProvider: Provider = {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const redis = new Redis(options.url || "redis://127.0.0.1:6379");
        return redis;
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: [REDIS_CLIENT],
      global: true,
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions) {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: async (...args: any[]) => {
            const redisModuleOptions = await options.useFactory(...args);
            return new Redis(
              redisModuleOptions.url || "redis://127.0.0.1:6379",
            );
          },
          inject: options.inject || [],
        },
      ],
      exports: [REDIS_CLIENT],
      global: true,
    };
  }
}
