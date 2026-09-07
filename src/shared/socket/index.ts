import type { FastifyInstance } from "fastify";
import { type Socket, Server as SocketServer } from "socket.io";
import { logger } from "../logger";

let io: SocketServer | null = null;

export function createSocketServer(app: FastifyInstance): SocketServer {
  io = new SocketServer(app.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    path: "/ws",
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    logger.info({ socketId: socket.id }, "Socket connected");

    socket.on("ping", (...args: unknown[]) => {
      socket.emit("pong", ...args);
    });

    socket.on("disconnect", (reason: string) => {
      logger.info({ socketId: socket.id, reason }, "Socket disconnected");
    });
    socket.onAny((event: string, _data: unknown) => {
      logger.info(
        {
          socketId: socket.id,
          event,
        },
        "Received socket message",
      );
    });
  });

  return io;
}

export function getSocketServer(): SocketServer | null {
  return io;
}
