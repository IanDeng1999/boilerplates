import axios, { type AxiosRequestConfig } from "axios";
import { io as createSocket } from "socket.io-client";
import { config } from "@/shared/config/config";
import { DEFAULT_HTTP_TIMEOUT, DEFAULT_SOCKET_CONFIG } from "./const";
import type { HttpResponse, IoConfig, SocketEventHandler } from "./types";

const SESSION_ID_KEY = "mige_session_id";

export class Io {
  readonly http;
  readonly socket;

  constructor(ioConfig: IoConfig) {
    const { url, ...socketOptions } = ioConfig.socket;

    this.http = axios.create({
      timeout: DEFAULT_HTTP_TIMEOUT,
      ...ioConfig.http,
    });

    // 请求拦截器：带上Authorization Bearer鉴权头
    this.http.interceptors.request.use((config) => {
      const sessionId = localStorage.getItem(SESSION_ID_KEY);
      if (sessionId) {
        config.headers.set("Authorization", `Bearer ${sessionId}`);
      }
      return config;
    });

    this.socket = createSocket(url, {
      ...DEFAULT_SOCKET_CONFIG,
      ...socketOptions,
    });
  }

  request<T>(config: AxiosRequestConfig) {
    return this.http.request<HttpResponse<T>>(config);
  }

  // 对外提供操作session的方法
  getSessionId(): string | null {
    return localStorage.getItem(SESSION_ID_KEY);
  }

  setSessionId(sessionId: string): void {
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  clearSessionId(): void {
    localStorage.removeItem(SESSION_ID_KEY);
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
