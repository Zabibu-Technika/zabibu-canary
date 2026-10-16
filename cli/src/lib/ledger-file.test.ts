import { after, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ledger-file resolves ~/.zabibucanary once, at import time, so redirect the home
// directory *before* importing it. Nothing in this file touches the real
// ~/.zabibucanary, and nothing here needs a git repo, a TUI or a network.
const home = mkdtempSync(join(tmpdir(), "canary-cli-"));
process.env.USERPROFILE = home; // Windows
process.env.HOME = home; // POSIX

const { appendApproval, approverFingerprint, approverKeyPath, exportLedgerBundle, ledgerPath, readLedger, verifyLocalLedger } =
  await import("./ledger-file.ts");
const { LEDGER_GENESIS, headFingerprint, keyFingerprint, verifyBundle } = await import("zabibucanary-engine");

after(() => rmSync(home, { recursive: true, force: true }));

test("keeps the ledger and the key under the home directory", () => {
  assert.equal(ledgerPath(), join(home, ".zabibucanary", "ledger.jsonl"));
  assert.equal(approverKeyPath(), join(home, ".zabibucanary", "approver.key"));
});

test("an untouched ledger is empty, and an empty chain still checks out", () => {
  assert.deepEqual(readLedger(), []);
  assert.ok(verifyLocalLedger());
});

test("approves, chains from the genesis, and links each record to its predecessor", () => {
  const first = appendApproval("analysis-1", "alice@example.com");
  const second = appendApproval("analysis-2", "alice@example.com");

  assert.equal(first.prevSig, LEDGER_GENESIS);
  assert.equal(second.prevSig, first.sig);
  assert.equal(readLedger().length, 2);
  assert.ok(verifyLocalLedger());
});

test("exports a bundle that verifies with nothing but the bundle", () => {
  const bundle = exportLedgerBundle();

  assert.equal(bundle.format, "zabibucanary/evidence/v1");
  assert.equal(bundle.algorithm, "ed25519");
  assert.equal(bundle.genesis, LEDGER_GENESIS);
  assert.equal(bundle.records.length, 2);
  assert.equal(bundle.head, bundle.records[1].sig);
  assert.deepEqual(verifyBundle(bundle), { ok: true });

  // The bundle carries its own public key, so a stranger needs nothing from this
  // machine — and the fingerprint is what you anchor elsewhere.
  assert.match(bundle.publicKey, /^-----BEGIN PUBLIC KEY-----/);
  assert.equal(keyFingerprint(bundle.publicKey), approverFingerprint());
  assert.match(headFingerprint(bundle), /^[0-9a-f]{64}$/);
});

test("the private key never travels with a receipt", () => {
  // Called out in the docs, so it is worth an assertion: an export is publishable.
  const exported = JSON.stringify(exportLedgerBundle());
  const privateKey = readFileSync(approverKeyPath(), "utf8").trim();

  assert.ok(!exported.includes("PRIVATE KEY"));
  assert.ok(!exported.includes(privateKey));
});

test("editing a stored record breaks the chain for good", () => {
  const file = ledgerPath();
  const lines = readFileSync(file, "utf8").split("\n").filter((line) => line.trim().length > 0);
  const tampered = JSON.parse(lines[0]) as Record<string, unknown>;
  tampered.signer = "attacker@example.com";
  lines[0] = JSON.stringify(tampered);
  writeFileSync(file, `${lines.join("\n")}\n`);

  assert.equal(verifyLocalLedger(), false);
  assert.equal(verifyBundle(exportLedgerBundle()).ok, false);
});
