import { absolute } from "./site";

export type PublicRoute = {
  path: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

// Every public, indexable URL on the site.
//
// Deliberately absent: /api/* (not content) and /analysis/* (per-session output
// behind a signed token — it renders fine, but it is nobody else's business, so
// it is also disallowed in robots.ts and carries a noindex.
export const PUBLIC_ROUTES: PublicRoute[] = [
  {
    path: "/",
    title: "the early-warning system for AI-made changes",
    description:
      "Review every line your coding agent writes before it ships — plain-English risk, five-sector damage maps, and Ed25519-signed approval receipts. Runs in your terminal or the browser.",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/alternatives",
    title: "alternatives — how canary compares",
    description:
      "Honest, feature-by-feature comparisons against CodeRabbit, GitHub Copilot code review and Qodo PR-Agent, including where each of them is the better tool.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/alternatives/coderabbit",
    title: "zabibu canary vs CodeRabbit",
    description:
      "CodeRabbit reviews pull requests in the cloud and ships a CLI for local pre-push review. Canary is the offline gate with no account and a receipt you can verify. A feature-level comparison.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/alternatives/copilot-code-review",
    title: "zabibu canary vs GitHub Copilot code review",
    description:
      "Copilot code review lives inside a GitHub pull request. Canary reviews the diff locally, in plain English, with five-sector impact and signed receipts.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/alternatives/pr-agent",
    title: "zabibu canary vs Qodo PR-Agent",
    description:
      "PR-Agent is an open-source (Apache-2.0) PR reviewer you self-host. Canary is a local, account-free CLI gate with a signed, independently verifiable approval ledger.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/embed",
    title: "badge & embed",
    description:
      "Put the zabibu canary badge in your README with honest, descriptive anchor text. One copy-paste snippet, no tracking pixel.",
    priority: 0.5,
    changeFrequency: "yearly",
  },
  {
    path: "/docs",
    title: "docs — overview",
    description: "What zabibu canary is, how it works and how to run it: the full manual.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/docs/installation",
    title: "docs — installation",
    description:
      "Install the CLI from npm, the curl script, or from source. Node 22.6+, no account, no API key.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/docs/commands",
    title: "docs — commands",
    description:
      "The complete command reference: review, watch, formats, the approval ledger (export/verify), hook install/remove, demo and the JSON output contract.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/docs/git-hooks",
    title: "docs — git hooks & CI",
    description:
      "Gate every push with a local pre-push hook, and run the same check in CI with --format github and a non-zero exit code.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/docs/how-it-works",
    title: "docs — how it works",
    description:
      "Deterministic rules over your diff: no model calls, no telemetry, reproducible across machines. How the engine reaches a verdict.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/docs/sectors",
    title: "docs — the five sectors",
    description:
      "Usage, trust, accessibility, security and dependability — what each damage sector measures and which detectors feed it.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/docs/web",
    title: "docs — the web app",
    description:
      "Paste a diff in the browser and get the same engine's report. Stateless with a signed token, database-backed when self-hosted.",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/docs/deployment",
    title: "docs — deployment",
    description: "How this site is deployed: Vercel, Node runtime, database-backed store with a local fallback.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  {
    path: "/docs/faq",
    title: "docs — FAQ",
    description:
      "Straight answers: is my code sent anywhere, do I need an API key, which coding agents work, what the licence is.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
];

/** Absolute URLs for every public route — used by the IndexNow payload. */
export function publicUrls(): string[] {
  return PUBLIC_ROUTES.map((r) => absolute(r.path));
}
