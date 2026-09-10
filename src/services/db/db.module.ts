import { defineConfig } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) => {
        const config = defineConfig({
          dbName: configService.getOrThrow("POSTGRE_NAME"),
          host: configService.getOrThrow("POSTGRE_HOST"),
          port:
            Number.parseInt(configService.getOrThrow("POSTGRE_PORT"), 10) ||
            5432,
          user: configService.getOrThrow("POSTGRE_USER"),
          password: configService.getOrThrow("POSTGRE_PASSWORD"),

          // 2. 实体配置
          entities: ["dist/**/entities/*.entity.js"], // 编译后的实体路径（TS 项目必填，需与 tsconfig 输出目录一致）
          entitiesTs: ["src/**/entities/*.entity.ts"], // 源码实体路径（用于 CLI 命令如迁移、生成实体）
        });
        return config;
      },
    }),
  ],
})
export class DbModule {}
