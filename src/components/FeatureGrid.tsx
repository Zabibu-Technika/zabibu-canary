import { BookOpen, FileSignature, Lock, Radar } from "lucide-react";

const FEATURES = [
  {
    icon: Lock,
    title: "Local-first, actually",
    body: "The CLI reviews on your machine. Your code never leaves it — and with local models, neither does the prompt.",
  },
  {
    icon: BookOpen,
    title: "Plain English, not lint spew",
    body: "Every finding says what it is, why it matters, and how to fix it. Readable by founders, PMs, and auditors — not just devs.",
  },
  {
    icon: Radar,
    title: "Five-sector damage map",
    body: "Security, trust, usage, accessibility, dependability. See exactly where a change can hurt, as a radar, bars, and heat grid.",
  },
  {
    icon: FileSignature,
    title: "Receipts, not comments",
    body: "Approvals are HMAC-signed and hash-chained into a tamper-evident ledger. Proof a human said yes — EU AI Act, SOC 2, SOX.",
  },
];

export function FeatureGrid() {
  return (
    <div className="feature-grid">
      {FEATURES.map((f) => (
        <article key={f.title} className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            <f.icon size={20} strokeWidth={1.75} />
          </span>
          <h3>{f.title}</h3>
          <p>{f.body}</p>
        </article>
      ))}
    </div>
  );
}
