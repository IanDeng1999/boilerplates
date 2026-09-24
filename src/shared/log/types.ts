import { LOG_LEVELS } from "./const";

export type LogLevel = (typeof LOG_LEVELS)[number];

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  extra?: unknown;
  timestamp: string;
}
