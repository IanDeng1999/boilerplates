import { Module } from "@nestjs/common";
import { CryptoService } from "./crypto/crypto.service.ts";

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CommonModule {}
