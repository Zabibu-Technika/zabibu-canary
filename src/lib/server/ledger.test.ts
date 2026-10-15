import { test } from "node:test";
import assert from "node:assert/strict";
import { signApproval, verifyChain, LEDGER_SEED, type ApprovalPayload } from "./ledger.ts";

const secret = "test-secret";
const payload = (n: number): ApprovalPayload => ({
  analysisId: `analysis-${n}`,
  signer: "alice@example.com",
  signedAt: `2026-10-15T10:0${n}:00.000Z`,
});

test("signs deterministically", () => {
  const a = signApproval(payload(1), LEDGER_SEED, secret);
  const b = signApproval(payload(1), LEDGER_SEED, secret);
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{64}$/);
});

test("verifies an untampered chain", () => {
  const sig1 = signApproval(payload(1), LEDGER_SEED, secret);
  const sig2 = signApproval(payload(2), sig1, secret);
  const sig3 = signApproval(payload(3), sig2, secret);
  assert.ok(
    verifyChain([payload(1), payload(2), payload(3)], [sig1, sig2, sig3], LEDGER_SEED, secret),
  );
});

test("rejects a tampered payload", () => {
  const sig1 = signApproval(payload(1), LEDGER_SEED, secret);
  const sig2 = signApproval(payload(2), sig1, secret);
  const tampered = { ...payload(2), signer: "attacker@example.com" };
  assert.ok(!verifyChain([payload(1), tampered], [sig1, sig2], LEDGER_SEED, secret));
});

test("rejects a tampered signature and a wrong seed", () => {
  const sig1 = signApproval(payload(1), LEDGER_SEED, secret);
  assert.ok(!verifyChain([payload(1)], [sig1], "wrong-seed", secret));
  assert.ok(!verifyChain([payload(1)], ["deadbeef"], LEDGER_SEED, secret));
  assert.ok(!verifyChain([], [], LEDGER_SEED, secret) === false); // empty chain is valid
});

test("rejects mismatched chain lengths", () => {
  const sig1 = signApproval(payload(1), LEDGER_SEED, secret);
  assert.ok(!verifyChain([payload(1), payload(2)], [sig1], LEDGER_SEED, secret));
});
