"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const SITE = "https://groundtruth-azure.vercel.app";

const TABS: { id: string; label: string; cmd: string }[] = [
  { id: "curl", label: "curl", cmd: `curl -fsSL ${SITE}/install | bash` },
  { id: "npm", label: "npm", cmd: "npm install -g zabibucanary" },
  { id: "bun", label: "bun", cmd: "bun add -g zabibucanary" },
  {
    id: "git",
    label: "git",
    cmd: "git clone https://github.com/Zabibu-Technika/zabibu-canary.git && cd zabibu-canary && npm install && npm link -w cli",
  },
];

export function InstallTabs() {
  const [active, setActive] = useState("curl");
  const [copied, setCopied] = useState(false);
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="install-tabs">
      <div className="install-tablist" role="tablist" aria-label="Install methods">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            className={`install-tab${t.id === active ? " active" : ""}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="install-cmd" role="tabpanel">
        <span className="term-prompt" aria-hidden="true">
          $
        </span>
        <code>{current.cmd}</code>
        <button className="btn" onClick={copy} aria-label="Copy install command">
          {copied ? <Check size={15} strokeWidth={2} aria-hidden="true" /> : <Copy size={15} strokeWidth={1.75} aria-hidden="true" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <p className="install-note">
        Works in any git repository. Requires Node 22+ and git. The npm and bun commands go live at
        public launch — the curl installer works today and falls back to a source install automatically.
      </p>
    </div>
  );
}
