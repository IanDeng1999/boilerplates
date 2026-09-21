import type { CreateAxiosDefaults } from "axios";
import type { ManagerOptions, SocketOptions } from "socket.io-client";

export type SocketConfig = Partial<ManagerOptions & SocketOptions> & {
  url: string;
};

export interface IoConfig {
  http?: CreateAxiosDefaults;
  socket: SocketConfig;
}

export interface HttpResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export type SocketEventHandler = (...args: unknown[]) => void;
