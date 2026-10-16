import { SECTORS, SECTOR_INFO } from "zabibucanary-engine";
import type { Metadata } from "next";
import { routeMetadata } from "@/lib/routes";

const DETAIL: Record<string, string> = {
  security:
    "Can the wrong people get in, or can data leak out? Driven by secrets, injection, auth-surface, and dangerous-code findings. This is the sector that gets people fired.",
  trust:
    "Can people believe the data — and prove who did what? Driven by schema changes, exposed secrets, and authorization changes.",
  usage:
    "Does the app keep working for everyone using it? Driven by infrastructure changes and very large diffs — the sector that shows up as 3am pages.",
  accessibility:
    "Can everyone use it — including keyboard and screen-reader users? Driven by removed focus outlines, blocked zoom, and unclickable-by-keyboard elements. The sector most teams never measure.",
  dependability:
    "Can you rely on it over time — updates, crashes, and rollbacks? Driven by dependency changes, lockfile drift, and schema changes that are hard to reverse.",
};

export const metadata: Metadata = routeMetadata("/docs/sectors");

export default function DocsSectors() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary sectors</p>
      <h1>The five sectors</h1>
      <p className="docs-lede">
        Most tools answer &ldquo;how many issues?&rdquo;. Canary answers &ldquo;where can this
        change hurt?&rdquo; — as a shape you can read in one glance.
      </p>

      {SECTORS.map((s) => (
        <section key={s} className="sector-doc">
          <h2>
            <span className="term-prompt" aria-hidden="true">{">"}</span>
            {SECTOR_INFO[s].label}
          </h2>
          <p className="sector-question">{SECTOR_INFO[s].question}</p>
          <p>{DETAIL[s]}</p>
        </section>
      ))}

      <h2>Reading the radar</h2>
      <ul className="docs-list">
        <li>Each axis is a sector, scored 0–3 from the strongest finding that touches it.</li>
        <li>A wide shape reaching the outer ring means the change can hurt in many places at once — even if the score is only moderate.</li>
        <li>A single deep spike (one sector at 3/3, the rest empty) is often <em>worse</em> than a broad shallow shape: one thing is very wrong.</li>
      </ul>

      <h2>Severity vs. sector</h2>
      <p>
        Severity answers <em>how bad is this finding</em>. The sector answers <em>what kind of
        damage</em>. A hardcoded secret is critical <em>and</em> mostly a security + trust problem;
        a dependency bump is medium <em>and</em> mostly a dependability problem. The two together
        are what make the report actionable.
      </p>
    </>
  );
}
