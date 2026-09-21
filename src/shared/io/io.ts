import axios, { type AxiosRequestConfig } from "axios";
import { io as createSocket } from "socket.io-client";
import { config } from "@/shared/config/config";
import { DEFAULT_HTTP_TIMEOUT, DEFAULT_SOCKET_CONFIG } from "./const";
import type { HttpResponse, IoConfig, SocketEventHandler } from "./types";

export class Io {
  readonly http;
  readonly socket;

  constructor(ioConfig: IoConfig) {
    const { url, ...socketOptions } = ioConfig.socket;

    this.http = axios.create({
      timeout: DEFAULT_HTTP_TIMEOUT,
      ...ioConfig.http,
    });
    this.socket = createSocket(url, {
      ...DEFAULT_SOCKET_CONFIG,
      ...socketOptions,
    });
  }

  request<T>(config: AxiosRequestConfig) {
    return this.http.request<HttpResponse<T>>(config);
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  on(event: string, handler: SocketEventHandler) {
    this.socket.on(event, handler);
  }

  off(event: string, handler?: SocketEventHandler) {
    this.socket.off(event, handler);
  }

  emit(event: string, ...args: unknown[]) {
    this.socket.emit(event, ...args);
  }
}

// 导出公共的Io实例，所有地方复用
export const io = new Io(config.io);
