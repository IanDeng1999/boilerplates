import { defineConfig } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) => {
        const config = defineConfig({
          clientUrl: configService.getOrThrow("DATABASE_URL"),

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
