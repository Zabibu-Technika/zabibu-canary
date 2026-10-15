import { getStore } from "@/lib/server/store";
import { NewAnalysisForm } from "@/components/NewAnalysisForm";
import { AnalysisTable } from "@/components/AnalysisTable";
import { InstallTabs } from "@/components/InstallTabs";
import { TerminalDemo } from "@/components/TerminalDemo";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const analyses = await getStore().listAnalyses(25);
  return (
    <main className="app-shell">
      {/* The whole site is one terminal session */}
      <section className="term-window">
        <div className="term-titlebar">
          <span className="term-dots" aria-hidden="true">
            <span className="term-dot r" />
            <span className="term-dot y" />
            <span className="term-dot g" />
          </span>
          <span className="term-title">zabibu@canary: ~/preflight — 80×24</span>
        </div>
        <div className="term-body">
          <p className="term-line">
            <span className="term-prompt">$</span>./canary --who
          </p>
          <h1 className="glow">
            Your AI never sleeps.
            <br />
            Neither does the blast radius.<span className="caret" aria-hidden="true" />
          </h1>
          <p className="lede">
            Every line your coding agent writes passes through zabibu canary before it ships —
            plain-English risk reports, five-sector damage maps, and a tamper-proof receipt proving a
            human said yes. Run it in your terminal, or right here in the browser. No coding skills
            required, ever.
          </p>
          <TerminalDemo />
        </div>
      </section>

      <section className="card" id="install">
        <h2>Install the CLI</h2>
        <p className="lede">
          The same engine, terminal-native. It watches your staged changes, gates every push, and
          never sends a byte of your code anywhere. This is the local alternative to CodeRabbit.
        </p>
        <InstallTabs />
      </section>

      <section className="card">
        <h2>How it works</h2>
        <ol className="steps">
          <li className="step">
            <span className="step-num">1</span>
            <div>
              <strong>Run it, or paste here.</strong>
              <br />
              <span className="helper">
                <code className="file-path">zabibucanary review</code> in any repo — or paste what your AI
                gave you below. No setup either way.
              </span>
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
        <h2>Check a change — in the browser</h2>
        <NewAnalysisForm />
        <p className="helper" style={{ marginTop: 14 }}>
          Works with anything your AI gave you — code blocks, git diffs, or notes. In the browser your
          checks stay in this session; in the CLI they never leave your machine.
        </p>
      </section>

      <section>
        <h2>Your recent checks</h2>
        <AnalysisTable analyses={analyses} />
      </section>

      <p className="credit">
        <strong>zabibu canary</strong> — a Zabibu Technika product · built by Tehillah Kachila ·{" "}
        <span className="term-green">MIT licensed</span>
      </p>
    </main>
  );
}
