// Tamper-evident approval ledger.
//
// v2 — asymmetric. Every link is an Ed25519 signature made with a private key
// that never leaves the approver's machine. Verification needs only the public
// key, which is the whole point: somebody who does not trust your machine — an
// auditor, a reviewer, a customer — can check the record for themselves.
//
// v1 used a shared HMAC secret, and that was a dead end for the promise. A
// verifier needed the same secret the signer held, so anyone able to verify could
// also forge, and the entire chain could be regenerated from scratch by whoever
// held the key. Symmetric crypto is right for a secret two parties both hold; it
// is the wrong tool for a receipt you hand to a stranger. The genesis string is
// versioned so old chains stay distinguishable rather than silently invalid.
//
// Chain: sig[i] = Ed25519(priv, genesis | sig[i-1] | analysisId | signer | signedAt)
//
// A signature alone stops edits, not deletion: the holder can still rewrite the
// whole chain and re-sign it. Publishing `headFingerprint()` somewhere the holder
// does not control (a git commit, OpenTimestamps, a public log) is what closes
// that hole. See docs/how-it-works.

import { createHash, generateKeyPairSync, sign as cryptoSign, verify as cryptoVerify } from "node:crypto";

export const LEDGER_GENESIS = "zabibucanary/genesis/v1";
export const LEDGER_ALGORITHM = "ed25519";
export const EVIDENCE_FORMAT = "zabibucanary/evidence/v1";

export interface ApprovalPayload {
  analysisId: string;
  signer: string;
  signedAt: string;
}

/** An approval payload plus the chain position it was signed into. */
export interface SignedRecord extends ApprovalPayload {
  prevSig: string;
  sig: string;
}

export interface SigningKeypair {
  privateKeyPem: string;
  publicKeyPem: string;
}

export interface EvidenceBundle {
  format: typeof EVIDENCE_FORMAT;
  algorithm: string;
  genesis: string;
  publicKey: string;
  head: string;
  createdAt: string;
  records: SignedRecord[];
}

/** A fresh Ed25519 keypair. Private key is PKCS#8 PEM, public is SPKI PEM. */
export function generateSigningKeypair(): SigningKeypair {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return {
    privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
  };
}

/** The exact bytes a signature covers. Field order is part of the format. */
export function recordBytes(prevSig: string, payload: ApprovalPayload): Buffer {
  return Buffer.from(`${prevSig}|${payload.analysisId}|${payload.signer}|${payload.signedAt}`, "utf8");
}

export function signApproval(payload: ApprovalPayload, prevSig: string, privateKeyPem: string): string {
  // Deliberately loud on failure: a silently unsigned approval is worse than a crash.
  return cryptoSign(null, recordBytes(prevSig, payload), privateKeyPem).toString("base64url");
}

export function verifyApproval(
  payload: ApprovalPayload,
  prevSig: string,
  sig: string,
  publicKeyPem: string,
): boolean {
  try {
    return cryptoVerify(null, recordBytes(prevSig, payload), publicKeyPem, Buffer.from(sig, "base64url"));
  } catch {
    // Malformed key or signature is a failed verification, not a crash.
    return false;
  }
}

export function verifyChain(
  payloads: ApprovalPayload[],
  signatures: string[],
  genesis: string,
  publicKeyPem: string,
): boolean {
  if (payloads.length !== signatures.length) return false;
  let prev = genesis;
  for (let i = 0; i < payloads.length; i++) {
    if (!verifyApproval(payloads[i], prev, signatures[i], publicKeyPem)) return false;
    prev = signatures[i];
  }
  return true;
}

/** The tip of the chain — the value to anchor externally. */
export function chainHead(records: SignedRecord[], genesis: string = LEDGER_GENESIS): string {
  return records.length > 0 ? records[records.length - 1].sig : genesis;
}

/**
 * A single self-contained file that proves the approvals it contains: the records,
 * the public key that signed them, and the chain tip. This is the artifact you
 * hand to somebody else.
 */
export function buildEvidenceBundle(
  records: SignedRecord[],
  publicKeyPem: string,
  createdAt: string = new Date().toISOString(),
): EvidenceBundle {
  return {
    format: EVIDENCE_FORMAT,
    algorithm: LEDGER_ALGORITHM,
    genesis: LEDGER_GENESIS,
    publicKey: publicKeyPem,
    head: chainHead(records),
    createdAt,
    records: records.map((r) => ({
      analysisId: r.analysisId,
      signer: r.signer,
      signedAt: r.signedAt,
      prevSig: r.prevSig,
      sig: r.sig,
    })),
  };
}

/**
 * Verify a bundle with nothing but the bundle. Checks three things: every link
 * signs the previous one, the stored `prevSig` pointers actually match (a field
 * the chain alone does not cover), and the published head is the real tip.
 */
export function verifyBundle(bundle: EvidenceBundle): { ok: boolean; reason?: string } {
  if (bundle?.format !== EVIDENCE_FORMAT) return { ok: false, reason: `unknown format: ${bundle?.format}` };
  if (bundle.algorithm !== LEDGER_ALGORITHM) return { ok: false, reason: `unsupported algorithm: ${bundle.algorithm}` };
  if (!Array.isArray(bundle.records)) return { ok: false, reason: "records is not an array" };

  let expectedPrev = bundle.genesis;
  for (let i = 0; i < bundle.records.length; i++) {
    const r = bundle.records[i];
    if (r.prevSig !== expectedPrev) {
      return { ok: false, reason: `record ${i} points at the wrong predecessor` };
    }
    if (!verifyApproval(r, r.prevSig, r.sig, bundle.publicKey)) {
      return { ok: false, reason: `record ${i} has an invalid signature` };
    }
    expectedPrev = r.sig;
  }

  if (expectedPrev !== bundle.head) {
    return { ok: false, reason: "published head does not match the chain tip" };
  }
  return { ok: true };
}

/**
 * Short fingerprint of the whole bundle (key + genesis + tip). Publish this where
 * you don't control it — that is what makes a wholesale rewrite detectable.
 */
export function headFingerprint(bundle: EvidenceBundle): string {
  return createHash("sha256")
    .update(`${bundle.algorithm}|${bundle.genesis}|${bundle.head}|${bundle.publicKey}`)
    .digest("hex");
}

/** Short, human-quotable form of a public key, for terminals and support threads. */
export function keyFingerprint(publicKeyPem: string): string {
  return createHash("sha256").update(publicKeyPem).digest("hex").slice(0, 16);
}
