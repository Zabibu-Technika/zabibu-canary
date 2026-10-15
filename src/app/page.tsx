import { getStore } from "@/lib/server/store";
import { NewAnalysisForm } from "@/components/NewAnalysisForm";
import { AnalysisTable } from "@/components/AnalysisTable";
import { InstallTabs } from "@/components/InstallTabs";
import { TerminalDemo } from "@/components/TerminalDemo";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CliHelp } from "@/components/CliHelp";
import { Comparison } from "@/components/Comparison";
import { CanaryLogo } from "@/components/CanaryLogo";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const analyses = await getStore().listAnalyses(25);
  return (
    <main className="app-shell">
      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className="topbar">
        <span className="brand">
          <CanaryLogo size={26} />
          zabibu canary
        </span>
        <span className="tagline">the safety check for AI-made changes</span>
      </header>

      {/* ── Hero: the whole site is one terminal session ─────────────────── */}
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

      {/* ── Install ─────────────────────────────────────────────────────── */}
      <section className="card" id="install">
        <h2>Install the CLI</h2>
        <p className="lede">
          The same engine, terminal-native. It watches your staged changes, gates every push, and
          never sends a byte of your code anywhere. This is the local alternative to CodeRabbit.
        </p>
        <InstallTabs />
      </section>

      {/* ── Why it hits different ───────────────────────────────────────── */}
      <section>
        <h2>Why it hits different</h2>
        <FeatureGrid />
      </section>

      {/* ── The CLI, documented ─────────────────────────────────────────── */}
      <section>
        <h2>The whole CLI, one screen</h2>
        <CliHelp />
      </section>

      {/* ── Comparison ──────────────────────────────────────────────────── */}
      <section>
        <h2>How it compares</h2>
        <Comparison />
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
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

      {/* ── In-browser check ────────────────────────────────────────────── */}
      <section className="card">
        <h2>Check a change — in the browser</h2>
        <NewAnalysisForm />
        <p className="helper" style={{ marginTop: 14 }}>
          Works with anything your AI gave you — code blocks, git diffs, or notes. In the browser your
          checks stay in this session; in the CLI they never leave your machine.
        </p>
      </section>

      {/* ── Recent checks ───────────────────────────────────────────────── */}
      <section>
        <h2>Your recent checks</h2>
        <AnalysisTable analyses={analyses} />
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-brand">
          <CanaryLogo size={30} />
          <div>
            <strong>zabibu canary</strong>
            <span className="helper">the safety check for AI-made changes</span>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="https://github.com/Zabibu-Technika/zabibu-canary" target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
          </a>
          <a href="/install">install script</a>
          <a href="#install">install the CLI</a>
          <a href="https://github.com/Zabibu-Technika/zabibu-canary#readme">docs</a>
        </nav>
        <p className="credit">
          a Zabibu Technika product · built by Tehillah Kachila · MIT licensed
        </p>
      </footer>
    </main>
  );
}
