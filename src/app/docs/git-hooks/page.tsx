export default function DocsGitHooks() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary hook</p>
      <h1>Git hooks &amp; CI</h1>
      <p className="docs-lede">
        The gate is the product. Once installed, risky changes cannot leave your machine unsigned —
        and the same engine annotates your PRs in CI.
      </p>

      <h2>The pre-push gate</h2>
      <pre className="docs-pre">{`cd your-repo
zabibucanary hook install`}</pre>
      <p>
        Writes <code className="file-path">.git/hooks/pre-push</code>. From then on, every{" "}
        <code className="file-path">git push</code> reviews the outgoing commit range first. If it finds
        critical issues, the push stops and tells you exactly what to do.
      </p>

      <h2>How an approval unblocks a push</h2>
      <p>
        Each review is identified by a hash of the exact diff. Approving in the TUI records an
        HMAC-signed receipt in <code className="file-path">~/.zabibucanary/ledger.jsonl</code>. The
        hook reviews the same diff again, recognizes the receipt, and lets the push through. The
        gate is therefore: <em>sign it once, and it ships.</em>
      </p>
      <pre className="docs-pre">{`$ git push
zabibu canary: push blocked. Run 'zabibucanary review' and approve, or set CANARY_ACK=1 to override.

$ zabibucanary review
... [a] approve & sign receipt
✓ approval receipt signed and recorded

$ git push     # now passes`}</pre>

      <h2>Emergency override</h2>
      <pre className="docs-pre">CANARY_ACK=1 git push</pre>
      <p>One-shot bypass. The report still prints, so nothing hides.</p>

      <h2>Watched mode for long sessions</h2>
      <pre className="docs-pre">zabibucanary review --watch</pre>
      <p>
        Re-runs the review as you save. Useful while an agent is churning through a task — you see
        the risk profile move in real time.
      </p>

      <h2>GitHub Actions</h2>
      <pre className="docs-pre">{`# .github/workflows/canary.yml
name: canary
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm install -g tsx   # or your own installer
      - run: npx tsx cli/src/index.tsx review --range origin/\${{ github.base_ref }}...HEAD --format github`}</pre>
      <p>
        Findings appear as inline annotations on the PR. Non-zero exit on critical findings fails
        the check — a real merge gate.
      </p>

      <h2>Any other CI</h2>
      <pre className="docs-pre">zabibucanary review --range $BASE...HEAD --format json &gt; canary.json</pre>
      <p>Pipe the JSON into whatever dashboard or budget gate you already run.</p>
    </>
  );
}
