import { Injectable, Logger } from "@nestjs/common";
import type { Server, Socket } from "socket.io";

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  joinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    this.logger.log(`Client ${client.id} joined room: ${roomId}`);
    client.to(roomId).emit("user_joined", { userId: client.id });
    return { status: "joined", roomId };
  }

  leaveRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    this.logger.log(`Client ${client.id} left room: ${roomId}`);
    client.to(roomId).emit("user_left", { userId: client.id });
    return { status: "left", roomId };
  }

  sendMessage(
    server: Server,
    client: Socket,
    payload: { roomId: string; message: string },
  ) {
    server.to(payload.roomId).emit("new_message", {
      senderId: client.id,
      message: payload.message,
      timestamp: new Date().toISOString(),
    });
  }
}
