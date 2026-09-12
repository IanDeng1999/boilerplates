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
