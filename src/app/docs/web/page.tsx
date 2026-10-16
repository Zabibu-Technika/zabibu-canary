import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { keyFingerprint } from "zabibucanary-engine";
import { routeMetadata } from "@/lib/routes";

export const metadata: Metadata = routeMetadata("/docs/web");

// Read at build time from the key we actually publish, so the fingerprint below
// cannot drift from the key a reader would download. Rotate the key and this
// page fixes itself; hard-code it and it becomes a lie the first time you do.
const PUBLISHED_KEY = readFileSync(join(process.cwd(), "public", "approver-public-key.pem"), "utf8");
const KEY_FINGERPRINT = keyFingerprint(PUBLISHED_KEY);

export default function DocsWeb() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary web</p>
      <h1>The web app</h1>
      <p className="docs-lede">
        The same engine, running at zabibucanary.vercel.app — for people who will never open a
        terminal, and for quick checks when you&apos;re already in the browser.
      </p>

      <h2>Checking a change</h2>
      <ol className="steps">
        <li className="step">
          <span className="step-num">1</span>
          <div>
            <strong>Paste anything.</strong>
            <br />
            <span className="helper">A code block from ChatGPT or Claude, a git diff, or notes about what changed. The engine figures out the format.</span>
          </div>
        </li>
        <li className="step">
          <span className="step-num">2</span>
          <div>
            <strong>Read the report.</strong>
            <br />
            <span className="helper">Risk score, verdict, plain-English findings, and the five-sector damage map — radar, bars, and heat grid.</span>
          </div>
        </li>
        <li className="step">
          <span className="step-num">3</span>
          <div>
            <strong>Sign the receipt.</strong>
            <br />
            <span className="helper">Enter your name and approve. The approval is Ed25519-signed and hash-chained exactly like the CLI&apos;s, but two things differ here: the key belongs to the deployment rather than to you, and the public demo does not keep the chain between instances — each fresh server starts its own. The CLI, or a self-hosted copy with a database, is where the key and the chain are genuinely yours.</span>
          </div>
        </li>
      </ol>

      <h2>What the numbers mean</h2>
      <table className="docs-table">
        <thead>
          <tr><th>Verdict</th><th>Trigger</th></tr>
        </thead>
        <tbody>
          <tr><td>Stop — fix these first</td><td>Any critical finding</td></tr>
          <tr><td>Check carefully before using</td><td>Any high finding</td></tr>
          <tr><td>A few things worth knowing</td><td>Medium findings only</td></tr>
          <tr><td>Looks good to go</td><td>Nothing above low</td></tr>
        </tbody>
      </table>

      <h2>Storage, honestly explained</h2>
      <ul className="docs-list">
        <li>
          <strong>Public demo</strong> — report pages render from a signed URL token, so they work on
          any server instance. Storage on that instance is a SQLite file, and on a serverless host the
          file is ephemeral: treat the demo&apos;s history and its ledger chain as short-lived, because
          they are. An approval you sign here is also kept in your browser&apos;s local storage.
        </li>
        <li>
          <strong>Self-hosted with a database</strong> — this is the durable configuration, and the one
          where the chain keeps growing instead of restarting. Local SQLite for development, Supabase
          Postgres for production (RLS enabled).
        </li>
        <li><strong>Either way</strong> — the text you paste is stored, with matched credential shapes redacted first. That is a safety net, not a guarantee: the detector only knows the shapes it knows. Don&apos;t paste production secrets into the public demo. API input is schema-validated.</li>
      </ul>

      <h2>Verifying a receipt</h2>
      <p>
        The deployment signs with a fixed Ed25519 key, so a receipt still verifies after a restart. The
        public half is published at{" "}
        <a href="/approver-public-key.pem">/approver-public-key.pem</a>{" "}
        <span className="helper">(fingerprint <code className="file-path">{KEY_FINGERPRINT}</code>)</span>;
        the private half lives only in the host&apos;s environment variables.
      </p>
      <p className="helper">
        A signature covers <code className="file-path">prevSig | analysisId | signer | signedAt</code>, so
        verifying one is a few lines of Node with the engine&apos;s{" "}
        <code className="file-path">verifyApproval()</code> — no account, no call back to us. In the CLI
        the key is yours instead of the deployment&apos;s, which is the stronger position.
      </p>

      <h2>Keyboard &amp; accessibility</h2>
      <ul className="docs-list">
        <li>Every control is reachable by keyboard; focus rings are always visible</li>
        <li>All animations honor <code className="file-path">prefers-reduced-motion</code></li>
        <li>Scores and metrics use tabular figures so nothing jitters as numbers change</li>
      </ul>
    </>
  );
}
