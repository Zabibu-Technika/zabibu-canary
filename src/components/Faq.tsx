import type { ReactNode } from "react";
import Link from "next/link";

export type FaqItem = { id: string; q: string; a: ReactNode };

// Single source of truth for the FAQ — rendered by both the landing page and
// /docs/faq, so the two can never drift apart.
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "privacy",
    q: "Is my code sent anywhere?",
    a: (
      <p>
        No. The CLI runs entirely on your machine — no accounts, no telemetry, no phone-home. It
        reads your diff, matches patterns locally, and prints a report. If you use the web app, what
        you paste is analyzed by the engine on the server, and matched secret values are flagged but
        never stored.
      </p>
    ),
  },
  {
    id: "models",
    q: "Does it need an AI model? Do I need an API key?",
    a: (
      <p>
        No. The engine is deterministic rules — no model calls in the core path, so it is
        reproducible, offline-capable, and free to run. Two people reviewing the same diff get the
        same report, and nothing leaves the machine. The explanations are written in plain English
        by the tool itself, so a model is never required to understand a finding.
      </p>
    ),
  },
  {
    id: "agents",
    q: "Which coding agents does it work with?",
    a: (
      <p>
        All of them, because it doesn&apos;t integrate with the agent — it reviews the output.
        Anything that ends up as a git diff or a block of text works: OpenCode, Claude Code, Cursor,
        Copilot, Aider, Codex, or a snippet you copied from a chat window. If your agent can produce
        a change, Canary can review it.
      </p>
    ),
  },
  {
    id: "pricing",
    q: "Is it free? What is the license?",
    a: (
      <p>
        Yes — MIT licensed, free to use, modify, and self-host. No seats, no usage metering, no
        subscription. The CLI, the hook, the engine, and the website are all in the same open-source
        repository.
      </p>
    ),
  },
  {
    id: "vs-coderabbit",
    q: "How is this different from CodeRabbit or Copilot code review?",
    a: (
      <p>
        Those tools review a pull request in the cloud, after the code has already left your
        machine. Canary reviews <em>before</em> the code leaves — a pre-push gate in your terminal,
        local-first and offline-capable — and it reports in plain English across five damage sectors
        with signed approval receipts. It is a complement, not a replacement: use it as the local
        gate, keep cloud review for the PR.
      </p>
    ),
  },
  {
    id: "disagree",
    q: "What if I disagree with a finding?",
    a: (
      <p>
        You can approve anyway, in one keystroke, and the receipt records that a human reviewed it.
        That is the whole point — the tool raises the question, a person decides. If a finding is
        genuinely a false positive, approving it is fast, and the approval is itself the audit
        trail. Every finding carries an explanation of exactly why it fired.
      </p>
    ),
  },
  {
    id: "replace-ci",
    q: "Does it replace my tests or CI?",
    a: (
      <p>
        No. Tests tell you whether behaviour works; Canary tells you whether <em>change</em> is safe
        to ship — secrets, schema, auth surface, dependency drift, scope creep. Run it before CI, not
        instead of it. It does slot straight into CI:{" "}
        <code className="file-path">--format github</code> prints inline annotations and a non-zero
        exit fails the check.
      </p>
    ),
  },
  {
    id: "ci",
    q: "Can I run it in CI?",
    a: (
      <p>
        Yes. It is non-interactive when there is nothing to approve: use{" "}
        <code className="file-path">--range &lt;base&gt;...HEAD</code> with{" "}
        <code className="file-path">--format json</code> or{" "}
        <code className="file-path">--format github</code>. Exit code 0 means clean or approved, 1
        means critical findings are unapproved. See{" "}
        <Link href="/docs/git-hooks">git hooks &amp; CI</Link>.
      </p>
    ),
  },
  {
    id: "name",
    q: "Why is it called canary?",
    a: (
      <p>
        A canary in a coal mine was the early-warning system — the bird felt the gas before the
        miners did. Canary does the same for AI-made changes: it feels the danger early, while the
        fix is still cheap, before it reaches production.
      </p>
    ),
  },
  {
    id: "who",
    q: "Who builds it?",
    a: (
      <p>
        It&apos;s a{" "}
        <a href="https://zabibu.vercel.app" target="_blank" rel="noreferrer">
          Zabibu Technika
        </a>{" "}
        product, built by Tehillah Kachila. The source is on GitHub at{" "}
        <a href="https://github.com/Zabibu-Technika/zabibu-canary" target="_blank" rel="noreferrer">
          Zabibu-Technika/zabibu-canary
        </a>{" "}
        — MIT licensed, and issues and pull requests are welcome.
      </p>
    ),
  },
];

export function FaqList({ items = FAQ_ITEMS, firstOpen = true }: { items?: FaqItem[]; firstOpen?: boolean }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details className="faq" key={item.id} open={firstOpen && i === 0 ? true : undefined}>
          <summary>{item.q}</summary>
          {item.a}
        </details>
      ))}
    </div>
  );
}
