import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import argon2 from "argon2";
import { decrypt, encrypt } from "eciesjs";

@Injectable()
export class CryptoService implements OnModuleInit {
  private readonly logger = new Logger(CryptoService.name);
  private eciesPrivateKey: string = "";
  private eciesPublicKey: string = "";

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.eciesPrivateKey =
      this.configService.getOrThrow<string>("ECIES_PRIVATE_KEY");
    this.eciesPublicKey =
      this.configService.getOrThrow<string>("ECIES_PUBLIC_KEY");

    this.logger.log("Loaded ECIES keys from environment");
  }

  async hashPassword(password: string) {
    return argon2.hash(password);
  }

  async verifyPassword(hash: string, password: string) {
    return argon2.verify(hash, password);
  }

  eciesEncrypt(data: string | Buffer) {
    return encrypt(this.eciesPublicKey, Buffer.from(data));
  }

  eciesDecrypt(encryptedData: Buffer | string) {
    const data =
      typeof encryptedData === "string"
        ? Buffer.from(encryptedData, "hex")
        : encryptedData;
    return decrypt(this.eciesPrivateKey, data);
  }

  getEciesPublicKey() {
    return this.eciesPublicKey;
  }
}
