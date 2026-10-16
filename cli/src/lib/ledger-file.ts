// Local approval ledger — a hash-chained JSONL file under the user's home dir.
//
// Signing is asymmetric (Ed25519, from the shared engine): the private key stays
// on this machine and never travels with a receipt, while verification needs only
// the public key. That is what lets somebody who does not trust your machine check
// the record. v1 used a shared HMAC secret, which meant anyone who could verify
// could also forge — see packages/engine/src/ledger.ts.
import { appendFileSync, chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createPrivateKey, createPublicKey, randomUUID } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  buildEvidenceBundle,
  generateSigningKeypair,
  keyFingerprint,
  LEDGER_GENESIS,
  signApproval,
  verifyChain,
  type ApprovalPayload,
  type EvidenceBundle,
  type SignedRecord,
  type SigningKeypair,
} from "zabibucanary-engine";

export interface LedgerRecord extends SignedRecord {
  id: string;
}

const DIR = join(homedir(), ".zabibucanary");
const FILE = join(DIR, "ledger.jsonl");
const KEY_FILE = join(DIR, "approver.key");

let cached: SigningKeypair | null = null;

export function ledgerPath(): string {
  return FILE;
}

export function approverKeyPath(): string {
  return KEY_FILE;
}

function publicKeyFor(privateKeyPem: string): string {
  return createPublicKey(createPrivateKey(privateKeyPem)).export({ type: "spki", format: "pem" }).toString();
}

/**
 * The approver keypair. Prefers `ZABIBU_SIGNING_KEY` (a PKCS#8 PEM, with literal
 * \n accepted so it can live in a single-line CI secret), otherwise creates a key
 * on first use and keeps it at ~/.zabibucanary/approver.key.
 */
export function approverKeys(): SigningKeypair {
  if (cached) return cached;

  const fromEnv = process.env.ZABIBU_SIGNING_KEY?.replace(/\\n/g, "\n");
  if (fromEnv?.includes("PRIVATE KEY")) {
    cached = { privateKeyPem: fromEnv, publicKeyPem: publicKeyFor(fromEnv) };
    return cached;
  }

  if (existsSync(KEY_FILE)) {
    const privateKeyPem = readFileSync(KEY_FILE, "utf8");
    cached = { privateKeyPem, publicKeyPem: publicKeyFor(privateKeyPem) };
    return cached;
  }

  const pair = generateSigningKeypair();
  mkdirSync(DIR, { recursive: true });
  writeFileSync(KEY_FILE, pair.privateKeyPem, { mode: 0o600 });
  try {
    chmodSync(KEY_FILE, 0o600);
  } catch {
    /* Windows filenames lack POSIX modes; ACLs already scope it to the user */
  }
  cached = pair;
  return cached;
}

/** Short, quotable identifier for this machine's approver key. */
export function approverFingerprint(): string {
  return keyFingerprint(approverKeys().publicKeyPem);
}

export function readLedger(): LedgerRecord[] {
  if (!existsSync(FILE)) return [];
  return readFileSync(FILE, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as LedgerRecord);
}

export function appendApproval(analysisId: string, signerName: string): LedgerRecord {
  const records = readLedger();
  const prevSig = records.length > 0 ? records[records.length - 1].sig : LEDGER_GENESIS;
  const payload: ApprovalPayload = { analysisId, signer: signerName, signedAt: new Date().toISOString() };
  const record: LedgerRecord = {
    id: randomUUID(),
    ...payload,
    prevSig,
    sig: signApproval(payload, prevSig, approverKeys().privateKeyPem),
  };
  mkdirSync(DIR, { recursive: true });
  appendFileSync(FILE, `${JSON.stringify(record)}\n`);
  return record;
}

export function verifyLocalLedger(): boolean {
  const records = readLedger();
  return verifyChain(records, records.map((r) => r.sig), LEDGER_GENESIS, approverKeys().publicKeyPem);
}

/**
 * A portable proof: the records, the public key that signed them, and the chain
 * tip. The bundle verifies on its own — no access to this machine, this CLI, or
 * this repository required.
 */
export function exportLedgerBundle(): EvidenceBundle {
  return buildEvidenceBundle(readLedger(), approverKeys().publicKeyPem);
}
