"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// One line of the mock review session.
function L({ children }: { children: ReactNode }) {
  return <div className="term-line">{children}</div>;
}

const LINES: ReactNode[] = [
  <L key="1">
    <span className="term-prompt">$</span>zabibucanary review --staged
  </L>,
  <L key="2">
    <span className="term-dim">[ zabibu canary ] a Zabibu Technika product · built by Tehillah Kachila</span>
  </L>,
  <L key="3">
    <span className="term-dim">reviewing 8 file change(s) · +24 / −2</span>
  </L>,
  <L key="4">
    risk <span className="term-red">100/100</span> · grade <span className="term-red">E</span> ·{" "}
    <span className="term-red">Stop — fix these first</span>
  </L>,
  <L key="5">
    <span className="term-dim">security&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <span className="term-red">████████████</span>
    <span className="term-dim"> 3/3 (6)</span>
  </L>,
  <L key="6">
    <span className="term-dim">trust&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <span className="term-red">████████████</span>
    <span className="term-dim"> 3/3 (4)</span>
  </L>,
  <L key="7">
    <span className="term-dim">usage&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <span className="term-yellow">████████░░░░</span>
    <span className="term-dim"> 2/3 (1)</span>
  </L>,
  <L key="8">
    <span className="term-dim">accessibility&nbsp;</span>
    <span className="term-red">████████████</span>
    <span className="term-dim"> 3/3 (2)</span>
  </L>,
  <L key="9">
    <span className="term-dim">dependability</span>
    <span className="term-red">████████████</span>
    <span className="term-dim"> 3/3 (5)</span>
  </L>,
  <L key="10">
    <span className="term-red">[critical]</span> A password or secret key is written right in the code
  </L>,
  <L key="11">
    <span className="term-dim">&nbsp;&nbsp;file: .env</span>
  </L>,
  <L key="12">
    <span className="term-dim">&nbsp;&nbsp;fix: move it to a private settings file, and change it now</span>
  </L>,
  <L key="13">
    <span className="term-dim">[a] approve &amp; sign receipt&nbsp;&nbsp;[q] quit</span>
  </L>,
];

export function TerminalDemo() {
  const reduce =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(reduce ? LINES.length : 1);

  useEffect(() => {
    if (shown >= LINES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 160);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div className="term-demo" aria-label="Example terminal output from zabibucanary review">
      {LINES.slice(0, shown)}
      {shown < LINES.length && <span className="term-caret-after" aria-hidden="true" />}
    </div>
  );
}
