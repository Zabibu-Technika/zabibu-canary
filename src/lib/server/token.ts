// Stateless, tamper-proof payload tokens for the public demo. Lets a detail
// page render on any server instance without a shared database.
// Server-only: uses node:crypto.
import { createHmac, timingSafeEqual } from "node:crypto";

function secret(): string {
  return process.env.APPROVAL_SECRET ?? "dev-only-secret-change-me";
}

export function seal(payload: unknown): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function unseal<T>(token: string): T | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(sig, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}
