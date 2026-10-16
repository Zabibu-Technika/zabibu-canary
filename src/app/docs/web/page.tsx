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
            <span className="helper">Enter your name and approve. The approval is Ed25519-signed and hash-chained, exactly like the CLI&apos;s — though here the key belongs to the deployment, not to you. The CLI is where the key is genuinely yours.</span>
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
        <li><strong>Public demo</strong> — report pages render from a signed URL token, so they work on every server instance. Approvals made on a token-rendered page live in your browser&apos;s local storage.</li>
        <li><strong>Self-hosted with a database</strong> — everything persists: local SQLite for development, Supabase Postgres for production (RLS enabled).</li>
        <li><strong>Either way</strong> — the text you paste is stored, secrets included: they are flagged in the report but not stripped from the copy. Don&apos;t paste production secrets into the public demo. API input is schema-validated.</li>
      </ul>

      <h2>Keyboard &amp; accessibility</h2>
      <ul className="docs-list">
        <li>Every control is reachable by keyboard; focus rings are always visible</li>
        <li>All animations honor <code className="file-path">prefers-reduced-motion</code></li>
        <li>Scores and metrics use tabular figures so nothing jitters as numbers change</li>
      </ul>
    </>
  );
}
