export type CookieKey = "session" | "client-id" | "oauth-state";

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none" | boolean;
  maxAge?: number;
  path?: string;
  domain?: string;
  expires?: Date;
}
