import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Namespace, Server, Socket } from "socket.io";
import { UseSocketAspects } from "../socket-aspects/decorators/socket-aspects.decorator.ts";
import { EventsService } from "./events.service.ts";

@WebSocketGateway({
  cors: { origin: "*", credentials: true },
  namespace: "events",
})
@UseSocketAspects()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private readonly eventsService: EventsService) {}

  afterInit(_namespace: Namespace) {
    this.logger.log("WebSocket Gateway initialized");
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join_room")
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    return this.eventsService.joinRoom(client, data.roomId);
  }

  @SubscribeMessage("leave_room")
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    return this.eventsService.leaveRoom(client, data.roomId);
  }

  @SubscribeMessage("send_message")
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; message: string },
  ) {
    this.eventsService.sendMessage(this.server, client, payload);
  }
}
