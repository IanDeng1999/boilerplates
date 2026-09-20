import { createHash, randomInt } from "node:crypto";
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Redis } from "ioredis";
import { REDIS_CLIENT } from "../../core/redis/redis.module.ts";

const CODE_TTL_SECONDS = 5 * 60;
const RESEND_TTL_SECONDS = 60;

@Injectable()
export class PhoneVerificationService {
  private readonly logger = new Logger(PhoneVerificationService.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly configService: ConfigService,
  ) {}

  async requestLoginCode(phone: string) {
    if (this.configService.get("NODE_ENV") === "production") {
      throw new ServiceUnavailableException("auth.smsNotConfigured");
    }

    const cooldownKey = `phone-login:cooldown:${phone}`;
    const available = await this.redisClient.set(
      cooldownKey,
      "1",
      "EX",
      RESEND_TTL_SECONDS,
      "NX",
    );
    if (!available) {
      throw new HttpException("auth.retryLater", HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = randomInt(100_000, 1_000_000).toString();
    await this.redisClient.set(
      `phone-login:code:${phone}`,
      this.hash(code),
      "EX",
      CODE_TTL_SECONDS,
    );

    this.logger.warn(`开发环境短信验证码 [${phone}]: ${code}`);
  }

  async verifyLoginCode(phone: string, code: string) {
    const key = `phone-login:code:${phone}`;
    const hash = await this.redisClient.getdel(key);
    if (!hash || hash !== this.hash(code)) {
      throw new UnauthorizedException("auth.verificationCodeInvalid");
    }
  }

  private hash(value: string) {
    return createHash("sha256").update(value).digest("hex");
  }
}
