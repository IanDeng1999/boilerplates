import { join } from "node:path";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { Logger } from "nestjs-pino";
import { v7 as uuidv7 } from "uuid";
import { AppModule } from "#src/app.module.js";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      genReqId: () => uuidv7(),
    }),
    {
      bufferLogs: true,
    },
  );
  const fastifyInstance: any = app.getHttpAdapter().getInstance();
  fastifyInstance.addHook(
    "preHandler",
    (req: FastifyRequest, reply: FastifyReply, done: () => void) => {
      // HACK: 把 Reply 挂到 Request 上
      req.replyRef = reply;
      // 把 LogID 挂到响应头上
      reply.header("x-log-id", req.id);
      done();
    },
  );

  const logger = app.get(Logger);
  app.useLogger(logger);

  const configService = app.get(ConfigService);

  // 注册cookie插件
  await app.register(fastifyCookie as any, {
    secret: configService.getOrThrow("SECRET"),
  });

  // 提供仓库根目录 public/ 下的静态资源，例如 /index.html。
  await app.register(fastifyStatic as any, {
    root: join(process.cwd(), "public"),
  });

  const isProd = configService.get("NODE_ENV") === "production";

  // Swagger 配置
  const swaggerConfig = new DocumentBuilder()
    .setTitle("NestJS API")
    .setDescription("The NestJS API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // 注册 Scalar API Reference 中间件
  app.use(
    "/reference",
    apiReference({
      content: document,
      withFastify: true,
    }),
  );

  const port = configService.get("APP_PORT");
  const host = configService.get("APP_HOST");
  await app.listen(port, host);
  logger.log({ isProd }, `Server running in http://${host}:${port}`, "NestApp");
}
await bootstrap();
