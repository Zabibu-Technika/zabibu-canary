import Link from "next/link";
import type { Metadata } from "next";
import { routeMetadata } from "@/lib/routes";

export const metadata: Metadata = routeMetadata("/docs");

export default function DocsOverview() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary</p>
      <h1>Overview</h1>
      <p className="docs-lede">
        zabibu canary is the early-warning system for AI-made changes. Point it at anything your coding
        agent produced — a git diff, a code block from ChatGPT or Claude, a whole working tree —
        and it tells you, in plain English, what could go wrong before it goes live.
      </p>

      <h2>The 60-second version</h2>
      <ol className="steps">
        <li className="step">
          <span className="step-num">1</span>
          <div>
            <strong>Install it</strong>
            <br />
            <span className="helper">
              <code className="file-path">curl -fsSL https://zabibucanary.vercel.app/install | bash</code> — or see the full installation guide.
            </span>
          </div>
        </li>
        <li className="step">
          <span className="step-num">2</span>
          <div>
            <strong>Run it in any repo</strong>
            <br />
            <span className="helper">
              <code className="file-path">zabibucanary review</code> reviews your staged changes, or
              the working tree. Press <code className="file-path">a</code> to approve,{" "}
              <code className="file-path">q</code> to quit.
            </span>
          </div>
        </li>
        <li className="step">
          <span className="step-num">3</span>
          <div>
            <strong>Gate every push</strong>
            <br />
            <span className="helper">
              <code className="file-path">zabibucanary hook install</code> blocks pushes whose changes
              carry critical findings without a signed approval.
            </span>
          </div>
        </li>
      </ol>

      <h2>Why it exists</h2>
      <p>
        AI writes most of the code now. CI catches broken code — but nothing catches{" "}
        <em>scope</em>: an agent asked to add a logout button quietly rewrites a migration, touches
        the auth middleware, and leaves a <code className="file-path">.env</code> in the diff.
        Canary maps the impact of every change across five sectors, explains it in words a
        founder or auditor can act on, and records a signed receipt proving a human reviewed it.
      </p>

      <h2>Three ways to run it</h2>
      <div className="docs-cards">
        <div className="docs-card">
          <h3>CLI</h3>
          <p>Local-first, terminal-native. Your code never leaves your machine. Works fully offline — no model required.</p>
        </div>
        <div className="docs-card">
          <h3>Git hook</h3>
          <p>A pre-push gate that runs the same review automatically. Blocks pushes with unapproved critical findings.</p>
        </div>
        <div className="docs-card">
          <h3>Web app</h3>
          <p>Paste what your AI gave you and read the report in a browser. Same engine, same reports.</p>
        </div>
      </div>

      <h2>Where to go next</h2>
      <ul className="docs-list">
        <li><Link href="/docs/installation">Installation</Link> — npm, npx, curl or source</li>
        <li><Link href="/docs/commands">Command reference</Link> — flags, formats, exit codes</li>
        <li><Link href="/docs/how-it-works">How it works</Link> — the engine, scoring, and the ledger</li>
        <li><Link href="/docs/sectors">The five sectors</Link> — security, trust, usage, accessibility, dependability</li>
      </ul>
    </>
  );
}
