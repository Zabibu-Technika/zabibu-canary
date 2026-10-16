import { BookOpen, FileSignature, Lock, Radar } from "lucide-react";

const FEATURES = [
  {
    icon: Lock,
    title: "Local-first, actually",
    body: "The CLI reviews on your machine — no networking code in the package, and no model to call. Your code never leaves it.",
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
    body: "Approvals are Ed25519-signed and hash-chained. The private key never leaves the machine, so anyone can verify the record from the public key alone — no trust in us required.",
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
