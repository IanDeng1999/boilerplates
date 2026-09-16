import { Module } from "@nestjs/common";
import { SocketAspectsModule } from "../socket-aspects/socket-aspects.module.ts";
import { EventsGateway } from "./events.gateway.ts";
import { EventsService } from "./events.service.ts";

@Module({
  imports: [SocketAspectsModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
