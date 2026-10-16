import Link from "next/link";
import { getStore } from "@/lib/server/store";
import { NewAnalysisForm } from "@/components/NewAnalysisForm";
import { AnalysisTable } from "@/components/AnalysisTable";
import { InstallTabs } from "@/components/InstallTabs";
import { TerminalDemo } from "@/components/TerminalDemo";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CliHelp } from "@/components/CliHelp";
import { Comparison } from "@/components/Comparison";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/jsonld";
import { CanaryLogo } from "@/components/CanaryLogo";
import { Topbar } from "@/components/Topbar";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const analyses = await getStore().listAnalyses(25);
  return (
    <main className="app-shell">
      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <Topbar />

      {/* ── 1 · The pitch: the whole site is one terminal session ────────── */}
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
            The canary warns you.
            <br />
            The ledger proves you listened.<span className="caret" aria-hidden="true" />
          </h1>
          <p className="lede">
            Every line your coding agent writes passes through zabibu canary before it ships. You get a
            plain-English report, a five-sector damage map, and a signed receipt that a human reviewed
            it — one anybody can verify from your public key, without trusting your machine or ours.
            Run it in your terminal, or right here in the browser. No coding skills required, ever.
          </p>
          <blockquote className="summary-chunk">
            <p>
              <strong>zabibu canary</strong> is a local-first pre-push gate for AI-made code changes.
              It reviews a diff in plain English across five damage sectors, then records a human
              approval as an Ed25519-signed receipt that anyone can verify from the public key alone.
            </p>
          </blockquote>
          <TerminalDemo />
        </div>
      </section>

      {/* ── 2 · Why it's different ──────────────────────────────────────── */}
      <section>
        <h2>Why it hits different</h2>
        <FeatureGrid />
      </section>

      {/* ── 3 · How it works ────────────────────────────────────────────── */}
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
              <span className="helper">You get a signed receipt proving a real person reviewed it before it went live — plus a bundle anyone can verify against your public key, on their own machine.</span>
            </div>
          </li>
        </ol>
      </section>

      {/* ── 4 · How it compares ─────────────────────────────────────────── */}
      <section>
        <h2>How it compares</h2>
        <Comparison />
      </section>

      {/* ── 5 · The CLI, documented ─────────────────────────────────────── */}
      <section>
        <h2>The whole CLI, one screen</h2>
        <CliHelp />
      </section>

      {/* ── 6 · Try it right here ───────────────────────────────────────── */}
      <section className="card">
        <h2>Check a change — in the browser</h2>
        <NewAnalysisForm />
        <p className="helper" style={{ marginTop: 14 }}>
          Works with anything your AI gave you — code blocks, git diffs, or notes. The browser demo
          stores what you paste (matched credential shapes are redacted first); the CLI never sends it
          anywhere. Use the CLI for anything sensitive.
        </p>
      </section>

      {/* ── 7 · Recent checks ───────────────────────────────────────────── */}
      <section>
        <h2>Your recent checks</h2>
        <AnalysisTable analyses={analyses} />
      </section>

      {/* ── 8 · Questions ───────────────────────────────────────────────── */}
      <section>
        <h2>The questions you&apos;re about to ask</h2>
        <p className="helper" style={{ marginBottom: 8 }}>
          Honest answers before you trust a tool with your code —{" "}
          <Link href="/docs/faq">all of them in the docs</Link>.
        </p>
        {/* Same questions, same answers, in schema form — generated from the list
            rendered below, so the markup can never describe a FAQ we don't show. */}
        <JsonLd id="faq" data={faqPageSchema()} />
        <FaqList />
      </section>

      {/* ── 9 · Install — the closing call to action ────────────────────── */}
      <section className="card" id="install">
        <h2>Install the CLI</h2>
        <p className="lede">
          One command. The same engine, terminal-native — it watches your staged changes, gates
          every push, and never sends a byte of your code anywhere. A local-first alternative to cloud
          reviewers like CodeRabbit and Copilot code review, and a complement to both.
        </p>
        <InstallTabs />
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-brand">
          <CanaryLogo size={30} />
          <div>
            <strong>zabibu canary</strong>
            <span className="helper">the early-warning system for AI-made changes</span>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="https://github.com/Zabibu-Technika/zabibu-canary" target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
          </a>
          <a href="https://zabibu.vercel.app" target="_blank" rel="noreferrer">
            zabibu technika <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
          </a>
          <a href="/install">install script</a>
          <a href="#install">install the CLI</a>
          <Link href="/alternatives">alternatives</Link>
          <Link href="/docs">docs</Link>
          <Link href="/embed">badge &amp; embed</Link>
        </nav>
        <p className="credit">
          a{" "}
          <a href="https://zabibu.vercel.app" target="_blank" rel="noreferrer">
            Zabibu Technika
          </a>{" "}
          product · built by Tehillah Kachila · MIT licensed
        </p>
      </footer>
    </main>
  );
}
