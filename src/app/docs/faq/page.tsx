export default function DocsFaq() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary faq</p>
      <h1>FAQ</h1>
      <p className="docs-lede">
        The questions people actually ask before they trust a tool with their code.
      </p>

      <details className="faq" open>
        <summary>Is my code sent anywhere?</summary>
        <p>
          No. The CLI runs entirely on your machine — no accounts, no telemetry, no phone-home. It
          reads your diff, matches patterns locally, and prints a report. If you use the web app,
          what you paste is analyzed by the engine on the server, and matched secret values are
          flagged but never stored.
        </p>
      </details>

      <details className="faq">
        <summary>Does it need an AI model? Do I need an API key?</summary>
        <p>
          No. The engine is deterministic rules — no model calls in the core path, so it is
          reproducible, offline-capable, and free to run. That means two people reviewing the same
          diff get the same report, and nothing leaves the machine. A model is never required to
          understand a finding; the explanations are written in plain English by the tool itself.
        </p>
      </details>

      <details className="faq">
        <summary>Which coding agents does it work with?</summary>
        <p>
          All of them, because it doesn&apos;t integrate with the agent — it reviews the output.
          Anything that ends up as a git diff or a block of text works: OpenCode, Claude Code,
          Cursor, Copilot, Aider, Codex, or a snippet you copied from a chat window. If your agent
          can produce a change, Canary can review it.
        </p>
      </details>

      <details className="faq">
        <summary>Is it free? What is the license?</summary>
        <p>
          Yes — MIT licensed, free to use, modify, and self-host. No seats, no usage metering, no
          subscription. The CLI, the hook, the engine, and the website are all in the same
          open-source repository.
        </p>
      </details>

      <details className="faq">
        <summary>How is this different from CodeRabbit or Copilot code review?</summary>
        <p>
          Those tools review a pull request in the cloud, after the code has already left your
          machine. Canary reviews <em>before</em> the code leaves — a pre-push gate in your
          terminal, local-first and offline-capable — and it reports in plain English across five
          damage sectors with signed approval receipts. It is a complement, not a replacement: use
          it as the local gate, keep cloud review for the PR.
        </p>
      </details>

      <details className="faq">
        <summary>What if I disagree with a finding?</summary>
        <p>
          You can approve anyway, in one keystroke, and the receipt records that a human reviewed
          it. That is the whole point — the tool raises the question, a person decides. If a finding
          is genuinely a false positive, approving it is fast and the approval is itself the
          audit trail. You can also read the explanation attached to each finding to see exactly
          why it fired.
        </p>
      </details>

      <details className="faq">
        <summary>Does it replace my tests or CI?</summary>
        <p>
          No. Tests tell you whether behaviour works; Canary tells you whether <em>change</em> is
          safe to ship — secrets, schema, auth surface, dependency drift, scope creep. Run it before
          CI, not instead of it. It does, however, slot straight into CI:{" "}
          <code className="file-path">--format github</code> prints inline annotations and a
          non-zero exit fails the check.
        </p>
      </details>

      <details className="faq">
        <summary>Can I run it in CI?</summary>
        <p>
          Yes. It is non-interactive when there is nothing to approve: use{" "}
          <code className="file-path">--range &lt;base&gt;...HEAD</code> with{" "}
          <code className="file-path">--format json</code> or{" "}
          <code className="file-path">--format github</code>. Exit code 0 means clean or approved,
          1 means critical findings are unapproved.
        </p>
      </details>

      <details className="faq">
        <summary>Why is it called canary?</summary>
        <p>
          A canary in a coal mine was the early-warning system — the bird felt the gas before the
          miners did. Canary does the same for AI-made changes: it feels the danger early, while
          the fix is still cheap, before it reaches production.
        </p>
      </details>

      <details className="faq">
        <summary>Who builds it?</summary>
        <p>
          It&apos;s a Zabibu Technika product, built by Tehillah Kachila. The source is on GitHub at{" "}
          <a href="https://github.com/Zabibu-Technika/zabibu-canary" target="_blank" rel="noreferrer">
            Zabibu-Technika/zabibu-canary
          </a>{" "}
          — issues and pull requests are welcome.
        </p>
      </details>

      <h2>Still stuck?</h2>
      <p>
        Open an issue on GitHub, or start with the{" "}
        <a href="/docs">overview</a> and the{" "}
        <a href="/docs/commands">command reference</a>.
      </p>
    </>
  );
}
