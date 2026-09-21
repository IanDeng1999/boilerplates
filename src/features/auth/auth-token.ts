export function getBearerToken(authorization: unknown) {
  if (typeof authorization !== "string") return undefined;
  const match = authorization.match(/^Bearer\s+(\S+)$/i);
  return match?.[1];
}
