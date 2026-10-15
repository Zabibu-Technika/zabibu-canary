"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const HELP = `usage:
  zabibucanary review              review staged changes (or the working tree)
    --staged                review only staged changes
    --working               review only the working tree
    --range <a>..<b>        review an explicit git range (used by the git hook)
    --watch, -w             re-review automatically as files change
    --format <fmt>          text (default) | json | github
  zabibucanary demo               run the bundled example review
  zabibucanary hook install       install the pre-push gate in this repo
  zabibucanary hook remove        remove the gate
  zabibucanary --version

exit codes: 0 = clean or approved · 1 = critical findings without a signed approval`;

export function CliHelp() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(HELP);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="term-window">
      <div className="term-titlebar">
        <span className="term-dots" aria-hidden="true">
          <span className="term-dot r" />
          <span className="term-dot y" />
          <span className="term-dot g" />
        </span>
        <span className="term-title">zabibu@canary: ~ — zabibucanary --help</span>
        <button className="btn help-copy" onClick={copy} aria-label="Copy the command reference">
          {copied ? <Check size={15} strokeWidth={2} aria-hidden="true" /> : <Copy size={15} strokeWidth={1.75} aria-hidden="true" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <div className="term-body">
        <pre className="help-pre">{HELP}</pre>
      </div>
    </div>
  );
}
