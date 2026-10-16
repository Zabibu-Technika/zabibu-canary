import Link from "next/link";
import type { Metadata } from "next";
import { routeMetadata } from "@/lib/routes";

export const metadata: Metadata = routeMetadata("/docs/commands");

export default function DocsCommands() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary</p>
      <h1>Command reference</h1>

      <h2>zabibucanary review</h2>
      <p>Analyzes changes and shows the report in your terminal.</p>
      <table className="docs-table">
        <thead>
          <tr><th>Flag</th><th>Default</th><th>What it does</th></tr>
        </thead>
        <tbody>
          <tr><td><code className="file-path">--staged</code></td><td>auto</td><td>Review only staged changes. Without flags: staged if any, else the working tree.</td></tr>
          <tr><td><code className="file-path">--working</code></td><td>—</td><td>Review only the working tree.</td></tr>
          <tr><td><code className="file-path">--range &lt;a&gt;..&lt;b&gt;</code></td><td>—</td><td>Review an explicit git range. This is what the push hook uses.</td></tr>
          <tr><td><code className="file-path">--watch, -w</code></td><td>—</td><td>Re-review automatically as files change (600 ms debounce).</td></tr>
          <tr><td><code className="file-path">--format &lt;fmt&gt;</code></td><td><code className="file-path">text</code></td><td><code className="file-path">text</code> · <code className="file-path">json</code> · <code className="file-path">github</code> (GitHub Actions annotations).</td></tr>
        </tbody>
      </table>
      <p>In the interactive view: <code className="file-path">a</code> approves and signs a receipt, <code className="file-path">q</code> quits.</p>

      <h2>zabibucanary demo</h2>
      <p>Runs the bundled example — a realistic risky diff from an AI coding session. The fastest way to see what a report looks like.</p>

      <h2>zabibucanary hook</h2>
      <table className="docs-table">
        <thead>
          <tr><th>Subcommand</th><th>What it does</th></tr>
        </thead>
        <tbody>
          <tr><td><code className="file-path">hook install</code></td><td>Writes a <code className="file-path">pre-push</code> gate into this repo&apos;s <code className="file-path">.git/hooks</code>.</td></tr>
          <tr><td><code className="file-path">hook remove</code></td><td>Removes it again.</td></tr>
        </tbody>
      </table>

      <h2>Exit codes</h2>
      <table className="docs-table">
        <thead>
          <tr><th>Code</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td className="meta">0</td><td>Clean, or every critical finding has a signed approval.</td></tr>
          <tr><td className="meta">1</td><td>Critical findings without a signed approval — hooks and CI should treat this as a stop.</td></tr>
        </tbody>
      </table>

      <h2>Machine output</h2>
      <pre className="docs-pre">zabibucanary review --format json &gt; report.json</pre>
      <p>
        JSON contains the risk score, grade, per-sector impact levels, and every finding with its
        category, severity, and explanation — everything the UI renders.
      </p>
      <pre className="docs-pre">zabibucanary review --format github</pre>
      <p>
        Prints GitHub Actions annotations (<code className="file-path">::error</code> /{" "}
        <code className="file-path">::warning</code>) that show up inline on the PR&apos;s Files tab.
      </p>

      <h2>zabibucanary ledger</h2>
      <pre className="docs-pre">{`zabibucanary ledger                     # records, chain status, key fingerprint
zabibucanary ledger export > proof.json # a self-contained, verifiable bundle
zabibucanary ledger verify proof.json   # check a bundle using only the file`}</pre>
      <p>
        An export carries the records, the public key and the chain tip, so somebody else can verify it
        without your machine, your repo, or any trust in this tool. See{" "}
        <Link href="/docs/how-it-works">how it works</Link> for the one thing a bundle cannot prove on
        its own.
      </p>

      <h2>Environment</h2>
      <table className="docs-table">
        <thead>
          <tr><th>Variable</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code className="file-path">ZABIBU_SIGNING_KEY</code></td><td>A PKCS#8 Ed25519 private key (PEM; literal <code className="file-path">\n</code> accepted). Signs receipts instead of the key auto-created at <code className="file-path">~/.zabibucanary/approver.key</code>.</td></tr>
          <tr><td><code className="file-path">CANARY_ACK=1</code></td><td>Override the gate once, for a push you have reviewed yourself.</td></tr>
        </tbody>
      </table>
    </>
  );
}
