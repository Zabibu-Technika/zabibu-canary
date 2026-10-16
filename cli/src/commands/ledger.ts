// `zabibucanary ledger [export|verify]` — inspect the local approval ledger, and
// hand somebody the proof.
//
// An approval nobody else can check is just a note to self. `export` produces a
// self-contained bundle (records + public key + chain tip) and `verify` checks one
// with nothing but the file — no access to this machine, this CLI or this repo.
import { readFileSync, writeFileSync } from "node:fs";
import { headFingerprint, keyFingerprint, verifyBundle, type EvidenceBundle } from "zabibucanary-engine";
import {
  approverFingerprint,
  approverKeyPath,
  exportLedgerBundle,
  ledgerPath,
  readLedger,
  verifyLocalLedger,
} from "../lib/ledger-file.ts";
import { C } from "../ui/text.ts";

const USAGE = "usage: zabibucanary ledger [export [file] | verify <file>]";

export function ledgerCommand(action?: string, target?: string): void {
  if (action === "export") return exportBundle(target);
  if (action === "verify") return verifyFile(target);
  if (action) {
    console.error(`zabibu canary: unknown ledger action "${action}".\n  ${USAGE}`);
    process.exitCode = 1;
    return;
  }
  status();
}

function status(): void {
  const records = readLedger();
  const valid = verifyLocalLedger();
  const chain = valid ? `${C.green}verified${C.reset}` : `${C.red}INVALID${C.reset}`;

  console.log(`${C.bold}${C.amber}[ zabibu canary ]${C.reset} approval ledger`);
  console.log("");
  console.log(`  ${C.gray}file      ${C.reset}${ledgerPath()}`);
  console.log(`  ${C.gray}records   ${C.reset}${records.length}`);
  console.log(`  ${C.gray}chain     ${C.reset}${chain} ${C.gray}(ed25519, single global chain)${C.reset}`);
  console.log(`  ${C.gray}approver  ${C.reset}${approverFingerprint()} ${C.gray}${approverKeyPath()}${C.reset}`);
  console.log("");
  console.log(`  ${C.gray}export${C.reset}   zabibucanary ledger export > canary-evidence.json`);
  console.log(`  ${C.gray}verify${C.reset}   zabibucanary ledger verify canary-evidence.json`);
  console.log(`  ${C.gray}anchor${C.reset}   publish the head fingerprint where you don't control it`);
}

function exportBundle(target?: string): void {
  const bundle = exportLedgerBundle();
  const json = `${JSON.stringify(bundle, null, 2)}\n`;

  if (target) {
    writeFileSync(target, json, "utf8");
    console.error(`${C.green}wrote ${target}${C.reset} — ${bundle.records.length} record(s)`);
  } else {
    // Human notes go to stderr so `ledger export > file.json` stays valid JSON.
    process.stdout.write(json);
  }

  console.error("");
  console.error(`  ${C.gray}records   ${C.reset}${bundle.records.length}`);
  console.error(`  ${C.gray}chain tip ${C.reset}${bundle.head.slice(0, 32)}…`);
  console.error(`  ${C.gray}head fp   ${C.reset}${C.amber}${headFingerprint(bundle)}${C.reset}`);
  console.error(`  ${C.gray}anchor    ${C.reset}commit or publish that fingerprint — it is what makes a rewrite detectable`);
}

function verifyFile(target?: string): void {
  if (!target) {
    console.error(`zabibu canary: no bundle given.\n  ${USAGE}`);
    process.exitCode = 1;
    return;
  }

  let bundle: EvidenceBundle;
  try {
    bundle = JSON.parse(readFileSync(target, "utf8")) as EvidenceBundle;
  } catch (err) {
    console.error(`zabibu canary: could not read ${target} (${err instanceof Error ? err.message : err}).`);
    process.exitCode = 1;
    return;
  }

  const result = verifyBundle(bundle);
  if (!result.ok) {
    console.error(`${C.red}FAILED${C.reset} — ${result.reason}`);
    process.exitCode = 1;
    return;
  }

  console.log(`${C.green}verified${C.reset} — ${bundle.records.length} record(s)`);
  console.log(`  ${C.gray}signing key      ${C.reset}${keyFingerprint(bundle.publicKey)}`);
  console.log(`  ${C.gray}head fingerprint ${C.reset}${headFingerprint(bundle)}`);
}
