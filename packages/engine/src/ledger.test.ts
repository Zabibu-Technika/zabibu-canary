import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildEvidenceBundle,
  chainHead,
  generateSigningKeypair,
  headFingerprint,
  keyFingerprint,
  LEDGER_GENESIS,
  signApproval,
  verifyBundle,
  verifyChain,
  type ApprovalPayload,
  type SigningKeypair,
} from "./ledger.ts";

// One keypair for the whole file — Ed25519 keygen is fast, but there is no reason
// to pay for it 10 times.
const keys: SigningKeypair = generateSigningKeypair();
const other: SigningKeypair = generateSigningKeypair();

const payload = (n: number): ApprovalPayload => ({
  analysisId: `analysis-${n}`,
  signer: "alice@example.com",
  signedAt: `2026-10-15T10:0${n}:00.000Z`,
});

const chain = (...ns: number[]) => {
  const payloads = ns.map(payload);
  const sigs: string[] = [];
  let prev = LEDGER_GENESIS;
  for (const p of payloads) {
    const sig = signApproval(p, prev, keys.privateKeyPem);
    sigs.push(sig);
    prev = sig;
  }
  return { payloads, sigs };
};

test("generates an ed25519 keypair as PEM", () => {
  assert.match(keys.privateKeyPem, /^-----BEGIN PRIVATE KEY-----/);
  assert.match(keys.publicKeyPem, /^-----BEGIN PUBLIC KEY-----/);
  assert.notEqual(keys.publicKeyPem, other.publicKeyPem);
});

test("signs deterministically, and to a base64url signature", () => {
  // Ed25519 is deterministic — the same input and key always produce the same
  // signature. That is what lets two people verify the same receipt byte-for-byte.
  const a = signApproval(payload(1), LEDGER_GENESIS, keys.privateKeyPem);
  const b = signApproval(payload(1), LEDGER_GENESIS, keys.privateKeyPem);
  assert.equal(a, b);
  assert.match(a, /^[A-Za-z0-9_-]{86}$/);
});

test("verifies an untampered chain", () => {
  const { payloads, sigs } = chain(1, 2, 3);
  assert.ok(verifyChain(payloads, sigs, LEDGER_GENESIS, keys.publicKeyPem));
});

test("rejects a tampered payload", () => {
  const sig1 = signApproval(payload(1), LEDGER_GENESIS, keys.privateKeyPem);
  const sig2 = signApproval(payload(2), sig1, keys.privateKeyPem);
  const tampered = { ...payload(2), signer: "attacker@example.com" };
  assert.ok(!verifyChain([payload(1), tampered], [sig1, sig2], LEDGER_GENESIS, keys.publicKeyPem));
});

test("rejects a missing or reordered link", () => {
  const { payloads, sigs } = chain(1, 2, 3);
  assert.ok(!verifyChain(payloads, [sigs[0], sigs[1]], LEDGER_GENESIS, keys.publicKeyPem));
  // Reordering breaks the chain because each link signs its predecessor.
  assert.ok(!verifyChain([payloads[1], payloads[0]], [sigs[1], sigs[0]], LEDGER_GENESIS, keys.publicKeyPem));
});

test("rejects a wrong genesis, a forged signature, and a different key", () => {
  const sig1 = signApproval(payload(1), LEDGER_GENESIS, keys.privateKeyPem);
  assert.ok(!verifyChain([payload(1)], [sig1], "wrong-genesis", keys.publicKeyPem));
  assert.ok(!verifyChain([payload(1)], ["not-a-signature"], LEDGER_GENESIS, keys.publicKeyPem));
  // The whole point of asymmetric signing: someone else's key cannot vouch for you.
  assert.ok(!verifyChain([payload(1)], [sig1], LEDGER_GENESIS, other.publicKeyPem));
});

test("an empty chain is valid, and a chain with no records has the genesis as its head", () => {
  assert.ok(verifyChain([], [], LEDGER_GENESIS, keys.publicKeyPem));
  assert.equal(chainHead([], LEDGER_GENESIS), LEDGER_GENESIS);
});

test("builds a self-contained bundle that verifies with only the bundle", () => {
  const { payloads, sigs } = chain(1, 2);
  const records = payloads.map((p, i) => ({
    ...p,
    prevSig: i === 0 ? LEDGER_GENESIS : sigs[i - 1],
    sig: sigs[i],
  }));
  const bundle = buildEvidenceBundle(records, keys.publicKeyPem, "2026-10-16T00:00:00.000Z");

  assert.equal(bundle.format, "zabibucanary/evidence/v1");
  assert.equal(bundle.algorithm, "ed25519");
  assert.equal(bundle.head, sigs[1]);
  assert.deepEqual(verifyBundle(bundle), { ok: true });
});

test("bundle verification catches a tampered record", () => {
  const { payloads, sigs } = chain(1, 2);
  const records = payloads.map((p, i) => ({
    ...p,
    prevSig: i === 0 ? LEDGER_GENESIS : sigs[i - 1],
    sig: sigs[i],
  }));
  const bundle = buildEvidenceBundle(records, keys.publicKeyPem);
  bundle.records[1].signer = "attacker@example.com";
  const result = verifyBundle(bundle);
  assert.equal(result.ok, false);
  assert.match(String(result.reason), /invalid signature/);
});

test("bundle verification catches a rewritten prevSig pointer", () => {
  // The chain alone does not cover the stored prevSig field, so this must be
  // checked separately — otherwise a record can claim the wrong ancestry.
  const { payloads, sigs } = chain(1, 2);
  const records = payloads.map((p, i) => ({
    ...p,
    prevSig: i === 0 ? LEDGER_GENESIS : sigs[i - 1],
    sig: sigs[i],
  }));
  const bundle = buildEvidenceBundle(records, keys.publicKeyPem);
  bundle.records[1].prevSig = "some-other-sig";
  assert.equal(verifyBundle(bundle).ok, false);
});

test("bundle verification catches a swapped public key", () => {
  const { payloads, sigs } = chain(1, 2);
  const records = payloads.map((p, i) => ({
    ...p,
    prevSig: i === 0 ? LEDGER_GENESIS : sigs[i - 1],
    sig: sigs[i],
  }));
  const swapped = buildEvidenceBundle(records, other.publicKeyPem);
  assert.equal(verifyBundle(swapped).ok, false);
});

test("a rebuilt shorter chain still verifies — which is exactly why you anchor the fingerprint", () => {
  // A signature stops edits, not deletion. Drop a record, re-sign the remainder
  // with the same key, and the bundle is internally consistent, so verifyBundle
  // passes. No amount of self-checking can catch this; only a fingerprint you
  // published somewhere the ledger holder does not control can.
  const { payloads, sigs } = chain(1, 2);
  const records = payloads.map((p, i) => ({
    ...p,
    prevSig: i === 0 ? LEDGER_GENESIS : sigs[i - 1],
    sig: sigs[i],
  }));
  const full = buildEvidenceBundle(records, keys.publicKeyPem);
  const rebuilt = buildEvidenceBundle(records.slice(0, 1), keys.publicKeyPem);

  assert.equal(verifyBundle(rebuilt).ok, true);
  assert.notEqual(headFingerprint(rebuilt), headFingerprint(full));
});

test("head fingerprint is stable, and moves when the head moves", () => {
  const { payloads, sigs } = chain(1, 2);
  const records = payloads.map((p, i) => ({
    ...p,
    prevSig: i === 0 ? LEDGER_GENESIS : sigs[i - 1],
    sig: sigs[i],
  }));
  const a = buildEvidenceBundle(records, keys.publicKeyPem);
  const b = buildEvidenceBundle(records, keys.publicKeyPem, "2030-01-01T00:00:00.000Z");
  // createdAt is not part of the fingerprint: the anchored value must not move
  // just because you re-exported the file.
  assert.equal(headFingerprint(a), headFingerprint(b));
  assert.match(headFingerprint(a), /^[0-9a-f]{64}$/);

  const trimmed = buildEvidenceBundle(records.slice(0, 1), keys.publicKeyPem);
  assert.notEqual(headFingerprint(a), headFingerprint(trimmed));
});

test("key fingerprint is short, stable and key-specific", () => {
  assert.equal(keyFingerprint(keys.publicKeyPem), keyFingerprint(keys.publicKeyPem));
  assert.match(keyFingerprint(keys.publicKeyPem), /^[0-9a-f]{16}$/);
  assert.notEqual(keyFingerprint(keys.publicKeyPem), keyFingerprint(other.publicKeyPem));
});
