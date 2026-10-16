// Server-side approver keys for the web app.
//
// Same construction as the CLI: approvals are Ed25519 signatures. The difference is
// custody. In the CLI the private key never leaves the approver's machine; here it
// has to be a deployment secret, because the demo has no per-user key management —
// a browser-side key would be the real answer, and it is noted as such in the docs.
//
// Set ZABIBU_SIGNING_KEY (PKCS#8 PEM) and ZABIBU_VERIFY_KEY (SPKI PEM). Literal \n
// is accepted so a PEM fits in a single-line environment variable on Vercel.
// Without them a key is generated per process, which keeps the demo honest rather
// than pretending: receipts stop verifying after a restart.
import { createPrivateKey, createPublicKey } from "node:crypto";
import { generateSigningKeypair, type SigningKeypair } from "zabibucanary-engine";

const unescape = (value: string) => value.replace(/\\n/g, "\n");

let ephemeral: SigningKeypair | null = null;

export function approverKeys(): SigningKeypair {
  const raw = process.env.ZABIBU_SIGNING_KEY;
  if (raw?.includes("PRIVATE KEY")) {
    const privateKeyPem = unescape(raw);
    const verify = process.env.ZABIBU_VERIFY_KEY;
    const publicKeyPem = verify?.includes("PUBLIC KEY")
      ? unescape(verify)
      : createPublicKey(createPrivateKey(privateKeyPem)).export({ type: "spki", format: "pem" }).toString();
    return { privateKeyPem, publicKeyPem };
  }

  if (!ephemeral) {
    ephemeral = generateSigningKeypair();
    console.warn(
      "[zabibu canary] ZABIBU_SIGNING_KEY is not set — signing with an ephemeral key. Receipts will not verify after a restart.",
    );
  }
  return ephemeral;
}
