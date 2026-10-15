// Local approval ledger — a hash-chained JSONL file under the user's home dir.
// Same HMAC chain construction as the web app (shared engine code).
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { LEDGER_SEED, signApproval, verifyChain, type ApprovalPayload } from "zabibucanary-engine";

export interface LedgerRecord extends ApprovalPayload {
  id: string;
  prevSig: string;
  sig: string;
  analysisId: string;
}

const DIR = join(homedir(), ".zabibucanary");
const FILE = join(DIR, "ledger.jsonl");

function secret(): string {
  return process.env.ZABIBU_SECRET ?? "zabibucanary-local-dev-secret";
}

export function ledgerPath(): string {
  return FILE;
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
  const prevSig = records.length > 0 ? records[records.length - 1].sig : LEDGER_SEED;
  const payload: ApprovalPayload = { analysisId, signer: signerName, signedAt: new Date().toISOString() };
  const record: LedgerRecord = {
    id: randomUUID(),
    ...payload,
    prevSig,
    sig: signApproval(payload, prevSig, secret()),
  };
  mkdirSync(DIR, { recursive: true });
  appendFileSync(FILE, `${JSON.stringify(record)}\n`);
  return record;
}

export function verifyLocalLedger(): boolean {
  const records = readLedger();
  return verifyChain(
    records.map((r) => ({ analysisId: r.analysisId, signer: r.signer, signedAt: r.signedAt })),
    records.map((r) => r.sig),
    LEDGER_SEED,
    secret(),
  );
}
