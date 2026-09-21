import { CONFIG_SCHEMA } from "./const";
import type { AppConfig } from "./types";

export const config: AppConfig = CONFIG_SCHEMA.parse({
  io: {
    http: {
      baseURL: import.meta.env.VITE_HTTP_BASE_URL,
      timeout: import.meta.env.VITE_HTTP_TIMEOUT,
      withCredentials: true,
    },
    socket: {
      url: import.meta.env.VITE_SOCKET_URL,
      autoConnect: import.meta.env.VITE_SOCKET_AUTO_CONNECT,
      reconnection: import.meta.env.VITE_SOCKET_RECONNECTION,
    },
  },
});
