import {
  FastifyReply as FastifyReplyType,
  FastifyRequest as FastifyRequestType,
} from "fastify";

declare module "pino-roll" {
  export function destination(options: {
    file: string;
    frequency?: "daily" | "hourly";
    size?: string;
    mkdir?: boolean;
    symlink?: boolean;
    compress?: boolean;
  }): NodeJS.WritableStream;
}
declare global {
  interface AuthedAccount {
    id: string;
    session: string;
  }
  type FastifyRequest = FastifyRequestType & {
    account?: AuthedAccount;
    replyRef: FastifyReplyType;
  };
  type FastifyReply = FastifyReplyType;
}
