import Link from "next/link";

export default function DocsHowItWorks() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary internals</p>
      <h1>How it works</h1>
      <p className="docs-lede">
        One engine powers the CLI, the hook, and the website. It is pure and dependency-free:
        parse, detect, score, map, sign.
      </p>

      <h2>1. Parse</h2>
      <p>
        The engine decides what you gave it. If it looks like a unified diff (git output), it parses
        per-file hunks — additions, deletions, added lines. Anything else (a code block from an AI
        chat, notes) is treated as free text and scanned line by line. Normies never need to know
        the difference.
      </p>

      <h2>2. Detect</h2>
      <p>Each detector maps matched lines to a finding with a severity and a plain-English explanation:</p>
      <table className="docs-table">
        <thead>
          <tr><th>Detector</th><th>Severity</th><th>Catches</th></tr>
        </thead>
        <tbody>
          <tr><td>Secrets</td><td>critical</td><td>Credential-shaped strings, <code className="file-path">.env</code> files in diffs</td></tr>
          <tr><td>Injection</td><td>high</td><td>SQL built by gluing strings together</td></tr>
          <tr><td>Dangerous code</td><td>high</td><td><code className="file-path">eval()</code>, shelling out with user text</td></tr>
          <tr><td>Authorization</td><td>high</td><td>Auth, session, permission, middleware changes</td></tr>
          <tr><td>Schema</td><td>high</td><td>Prisma schemas, migrations, <code className="file-path">.sql</code></td></tr>
          <tr><td>Supply chain</td><td>medium</td><td>New dependencies, unpinned versions, lockfile churn</td></tr>
          <tr><td>Infrastructure</td><td>medium</td><td>Dockerfiles, CI workflows, deploy configs</td></tr>
          <tr><td>Accessibility</td><td>medium</td><td>Removed focus outlines, blocked zoom, div-onClick</td></tr>
          <tr><td>Scope</td><td>medium</td><td>Diffs over 25 files or 500 net lines</td></tr>
          <tr><td>Tests</td><td>info</td><td>Test changes alongside the diff — slightly lowers the score</td></tr>
        </tbody>
      </table>

      <h2>3. Score</h2>
      <p>
        Weighted sum: <strong>critical 34 · high 17 · medium 8 · low 3</strong>, minus up to 9 for
        accompanying tests, clamped to 0–100. Grades: A &lt; 15, B &lt; 30, C &lt; 50, D &lt; 70, E above.
        The verdict comes from the worst finding: any critical → <em>Stop — fix these first</em>;
        any high → <em>Check carefully before using</em>.
      </p>

      <h2>4. Map</h2>
      <p>
        Every finding projects onto five damage sectors — see <Link href="/docs/sectors">the five
        sectors</Link>. Each sector gets a level 0–3 from the strongest finding that touches it,
        rendered as a radar, bars, and a findings-by-sector heat grid in both UIs.
      </p>

      <h2>5. Sign</h2>
      <p>
        An approval is an <strong>Ed25519 signature</strong> over{" "}
        <code className="file-path">analysisId | signer | signedAt</code>, chained to the previous
        signature — starting from a fixed genesis. Change any record and every later signature fails.
      </p>
      <pre className="docs-pre">{`sig[0] = Ed25519(priv, genesis | payload[0])
sig[1] = Ed25519(priv, sig[0]   | payload[1])
...`}</pre>
      <p>
        The private key stays where the approval happened; verification needs only the public key. That
        asymmetry is the entire point — a third party can check the record without being able to
        produce a fake one. When signer and verifier share a secret, anyone who can verify can also
        forge, and the whole chain can be regenerated from scratch. (An earlier version of Canary did
        exactly that with HMAC. It is kept in this paragraph only as a warning.)
      </p>
      <p>
        A signature stops <em>edits</em>, not deletion: whoever holds the ledger file can always drop
        records and re-sign the remainder with the same key. So the head of the chain is fingerprinted,
        and the fingerprint is meant to be anchored somewhere you don&apos;t control — a signed commit,
        OpenTimestamps, a public log. Anchoring is the step that makes a wholesale rewrite detectable,
        and no amount of self-checking can replace it.
      </p>
      <p>
        In the CLI the chain lives at <code className="file-path">~/.zabibucanary/ledger.jsonl</code>{" "}
        and the key at <code className="file-path">~/.zabibucanary/approver.key</code>. Export a
        portable proof with <code className="file-path">zabibucanary ledger export</code>, and check
        one anywhere with <code className="file-path">zabibucanary ledger verify &lt;file&gt;</code>.
      </p>

      <h2>What it deliberately does not do</h2>
      <ul className="docs-list">
        <li>No model calls in the deterministic core — the engine is rules, reproducible and offline</li>
        <li>No telemetry, no accounts, no phone-home</li>
        <li>No code execution of the analyzed content</li>
      </ul>
    </>
  );
}
