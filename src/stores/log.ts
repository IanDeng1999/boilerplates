import { defineStore } from "pinia";
import { ref } from "vue";
import { MAX_LOG_ENTRIES } from "../shared/log/const";
import type { LogEntry, LogLevel } from "../shared/log/types";

let logSequence = 0;

function createLogId() {
  logSequence += 1;
  return `${Date.now()}-${logSequence}`;
}

function serializeExtra(extra: unknown): unknown {
  if (extra instanceof Error) {
    return {
      name: extra.name,
      message: extra.message,
      stack: extra.stack ?? "",
    };
  }

  try {
    const value = JSON.stringify(extra);
    return value === undefined ? String(extra) : JSON.parse(value);
  } catch {
    return String(extra);
  }
}

function writeToConsole(level: LogLevel, message: string, extra?: unknown) {
  if (extra === undefined) {
    console[level](message);
    return;
  }

  console[level](message, extra);
}

export const useLogStore = defineStore(
  "log",
  () => {
    const entries = ref<LogEntry[]>([]);

    function log(level: LogLevel, message: string, extra?: unknown) {
      entries.value.unshift({
        id: createLogId(),
        level,
        message,
        ...(extra === undefined ? {} : { extra: serializeExtra(extra) }),
        timestamp: new Date().toISOString(),
      });
      entries.value = entries.value.slice(0, MAX_LOG_ENTRIES);
      writeToConsole(level, message, extra);
    }

    function debug(message: string, extra?: unknown) {
      log("debug", message, extra);
    }

    function info(message: string, extra?: unknown) {
      log("info", message, extra);
    }

    function warn(message: string, extra?: unknown) {
      log("warn", message, extra);
    }

    function error(message: string, extra?: unknown) {
      log("error", message, extra);
    }

    function clear() {
      entries.value = [];
    }

    return { entries, debug, info, warn, error, clear };
  },
  {
    persist: {
      key: "app-logs",
    },
  },
);
