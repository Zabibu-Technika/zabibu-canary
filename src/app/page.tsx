import { getStore } from "@/lib/server/store";
import { NewAnalysisForm } from "@/components/NewAnalysisForm";
import { AnalysisTable } from "@/components/AnalysisTable";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const analyses = await getStore().listAnalyses(25);
  return (
    <main className="app-shell">
      <header className="topbar">
        <span className="brand">
          <ShieldCheck size={22} strokeWidth={1.75} aria-hidden="true" />
          zabibu canary
        </span>
        <span className="tagline">the safety check for AI-made changes</span>
      </header>

      <section className="card">
        <h1>
          Your AI wrote the code. But what could go wrong?
          <span className="caret" aria-hidden="true" />
        </h1>
        <p className="lede">
          Tools like ChatGPT, Claude, and Copilot — and coding agents like OpenCode, Claude Code, and
          Cline — now write a lot of the code behind apps and websites. Most of it is fine — until it
          quietly touches passwords, who gets in, or the pieces that keep everything running.
          Zabibu Canary checks any change in plain English, before it goes live. No coding skills required.
        </p>
        <h2>How it works</h2>
        <ol className="steps">
          <li className="step">
            <span className="step-num">1</span>
            <div>
              <strong>Paste what your AI gave you.</strong>
              <br />
              <span className="helper">Any code or changes — from an AI chat, or a coding agent like OpenCode, Claude Code, or Cline. No setup.</span>
            </div>
          </li>
          <li className="step">
            <span className="step-num">2</span>
            <div>
              <strong>Read the report in plain English.</strong>
              <br />
              <span className="helper">Every risk comes with what it means, why it matters, and how to fix it. Worst first.</span>
            </div>
          </li>
          <li className="step">
            <span className="step-num">3</span>
            <div>
              <strong>Approve with one click.</strong>
              <br />
              <span className="helper">You get a tamper-proof receipt proving a real person said yes before this went live.</span>
            </div>
          </li>
        </ol>
      </section>

      <section className="card">
        <h2>Check a change</h2>
        <NewAnalysisForm />
        <p className="helper" style={{ marginTop: 14 }}>
          Everything stays on your own computer — no account, no cloud, nothing to install.
          Prefer your terminal? <code className="file-path">npx zabibu-canary review</code> runs the
          same engine locally, with a git hook that gates every push.
        </p>
      </section>

      <section>
        <h2>Your recent checks</h2>
        <AnalysisTable analyses={analyses} />
      </section>

      <p className="credit">
        <strong>zabibu canary</strong> — a Zabibu Technika product · built by Tehillah Kachila
      </p>
    </main>
  );
}
