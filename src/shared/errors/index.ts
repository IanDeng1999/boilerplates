export class HTTPError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "HTTPError";
    this.statusCode = statusCode;
    this.code = code;
  }
}
