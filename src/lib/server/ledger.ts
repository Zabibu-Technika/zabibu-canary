// Tamper-evident approval ledger. Pure functions over node:crypto so the logic
// can be unit-tested without a database or server.
// Chain: sig[i] = HMAC(secret, sig[i-1] + "|" + analysisId + "|" + signer + "|" + signedAt)

import { createHmac } from "node:crypto";

export const LEDGER_SEED = "groundtruth-genesis";

export interface ApprovalPayload {
  analysisId: string;
  signer: string;
  signedAt: string;
}

export function signaturePayload(a: ApprovalPayload): string {
  return `${a.analysisId}|${a.signer}|${a.signedAt}`;
}

export function signApproval(payload: ApprovalPayload, prevSig: string, secret: string): string {
  const h = createHmac("sha256", secret);
  h.update(`${prevSig}|${signaturePayload(payload)}`);
  return h.digest("hex");
}

export function verifyChain(
  payloads: ApprovalPayload[],
  signatures: string[],
  seed: string,
  secret: string,
): boolean {
  if (payloads.length !== signatures.length) return false;
  let prev = seed;
  for (let i = 0; i < payloads.length; i++) {
    const expected = signApproval(payloads[i], prev, secret);
    if (expected !== signatures[i]) return false;
    prev = signatures[i];
  }
  return true;
}
