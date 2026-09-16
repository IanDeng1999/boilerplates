import { Module } from "@nestjs/common";
import { AssetModule } from "./asset/asset.module.ts";
import { AuthModule } from "./auth/auth.module.ts";
import { BookModule } from "./book/book.module.ts";
import { CronjobModule } from "./cronjob/cronjob.module.ts";
import { EventsModule } from "./events/events.module.ts";
import { HealthModule } from "./health/health.module.ts";
import { UserModule } from "./user/user.module.ts";

@Module({
  imports: [
    BookModule,
    CronjobModule,
    HealthModule,
    AuthModule,
    UserModule,
    AssetModule,
    EventsModule,
  ],
})
export class FeaturesModule {}
