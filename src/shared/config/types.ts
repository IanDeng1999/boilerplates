import type { z } from "zod";
import type { CONFIG_SCHEMA } from "./const";

export type AppConfig = z.infer<typeof CONFIG_SCHEMA>;
