// Lightweight, curated search index for the docs. Every entry points at a real
// page and carries the words a reader would actually type. No dependencies, no
// network — the whole index ships with the client bundle.

export type DocEntry = {
  id: string;
  title: string;
  section: string;
  href: string;
  /** Space-separated keywords and phrases, matched case-insensitively. */
  text: string;
};

export const DOC_INDEX: DocEntry[] = [
  // ── Overview ──────────────────────────────────────────────────────────────
  {
    id: "overview",
    title: "Overview",
    section: "Getting started",
    href: "/docs",
    text: "what is zabibu canary safety check for ai-made changes introduced quickstart 60 second version blast radius plain english",
  },
  {
    id: "overview-why",
    title: "Why it exists",
    section: "Getting started",
    href: "/docs",
    text: "why scope creep agent asked to add a logout button rewrote migration auth middleware dotenv ci catches broken code nothing catches scope",
  },
  {
    id: "overview-run",
    title: "Three ways to run it",
    section: "Getting started",
    href: "/docs",
    text: "cli git hook web app browser paste terminal three ways",
  },

  // ── Installation ──────────────────────────────────────────────────────────
  {
    id: "install",
    title: "Installation",
    section: "Getting started",
    href: "/docs/installation",
    text: "install set up requirements node 22 six git get started four ways",
  },
  {
    id: "install-script",
    title: "Install script",
    section: "Getting started",
    href: "/docs/installation",
    text: "curl fsSL install bash one line shell script automated",
  },
  {
    id: "install-npm",
    title: "Install with npm or bun",
    section: "Getting started",
    href: "/docs/installation",
    text: "npm install dash g global zabibucanary bun add package registry published",
  },
  {
    id: "install-source",
    title: "Install from source",
    section: "Getting started",
    href: "/docs/installation",
    text: "git clone github npm link workspace build from source contributor",
  },
  {
    id: "install-once",
    title: "One-off run with npx",
    section: "Getting started",
    href: "/docs/installation",
    text: "npx tsx raw githubusercontent demo no install scratch ci ephemeral",
  },
  {
    id: "install-verify",
    title: "Verify the install",
    section: "Getting started",
    href: "/docs/installation",
    text: "version verify demo check it works first review",
  },
  {
    id: "install-uninstall",
    title: "Uninstalling",
    section: "Getting started",
    href: "/docs/installation",
    text: "uninstall remove global package hook remove receipts ledger left behind",
  },

  // ── Commands ──────────────────────────────────────────────────────────────
  {
    id: "cmd-review",
    title: "zabibucanary review",
    section: "CLI",
    href: "/docs/commands",
    text: "review command analyze changes staged working tree range flag watch interactive approve quit",
  },
  {
    id: "cmd-flags",
    title: "Review flags",
    section: "CLI",
    href: "/docs/commands",
    text: "staged working range watch dash w format text json github interactive approve quit debounce",
  },
  {
    id: "cmd-demo",
    title: "zabibucanary demo",
    section: "CLI",
    href: "/docs/commands",
    text: "demo bundled example risky diff sample fastest way to see a report",
  },
  {
    id: "cmd-hook",
    title: "zabibucanary hook",
    section: "CLI",
    href: "/docs/commands",
    text: "hook install remove pre-push gate git hooks subcommand",
  },
  {
    id: "cmd-exit",
    title: "Exit codes",
    section: "CLI",
    href: "/docs/commands",
    text: "exit codes zero one clean critical findings unapproved ci gate status",
  },
  {
    id: "cmd-machine",
    title: "Machine output — json and github",
    section: "CLI",
    href: "/docs/commands",
    text: "machine output format json github actions annotations error warning parse pipeline report file",
  },
  {
    id: "cmd-env",
    title: "Environment variables",
    section: "CLI",
    href: "/docs/commands",
    text: "environment variables zabibu secret hmac receipt canary ack override",
  },

  // ── Git hooks & CI ────────────────────────────────────────────────────────
  {
    id: "hooks",
    title: "Git hooks & CI",
    section: "CLI",
    href: "/docs/git-hooks",
    text: "git hooks ci pre-push gate install block push unsigned risky changes leave machine",
  },
  {
    id: "hooks-approval",
    title: "How an approval unblocks a push",
    section: "CLI",
    href: "/docs/git-hooks",
    text: "approval unblock push diff hash receipt signed sign it once and it ships hmac",
  },
  {
    id: "hooks-override",
    title: "Emergency override",
    section: "CLI",
    href: "/docs/git-hooks",
    text: "emergency override canary ack one-shot bypass still prints report",
  },
  {
    id: "hooks-watch",
    title: "Watched mode",
    section: "CLI",
    href: "/docs/git-hooks",
    text: "watched mode watch long sessions as you save real time risk profile",
  },
  {
    id: "hooks-actions",
    title: "GitHub Actions",
    section: "CLI",
    href: "/docs/git-hooks",
    text: "github actions workflow yml pull request inline annotations merge gate other ci",
  },

  // ── How it works ──────────────────────────────────────────────────────────
  {
    id: "how",
    title: "How it works",
    section: "Concepts",
    href: "/docs/how-it-works",
    text: "how it works engine internals parse detect score map sign pipeline pure dependency free",
  },
  {
    id: "how-detect",
    title: "Detectors",
    section: "Concepts",
    href: "/docs/how-it-works",
    text: "detectors secrets injection dangerous code authorization schema supply chain infrastructure accessibility scope tests severity",
  },
  {
    id: "how-scoring",
    title: "Scoring and grades",
    section: "Concepts",
    href: "/docs/how-it-works",
    text: "scoring score grades a b c d e weights critical high medium low tests mitigate verdict clamped 100",
  },
  {
    id: "how-sign",
    title: "Signed receipts and the ledger",
    section: "Concepts",
    href: "/docs/how-it-works",
    text: "signed receipts ledger hmac sha256 chain genesis seed tamper evident ledger jsonl approval signature",
  },
  {
    id: "how-not",
    title: "What it deliberately does not do",
    section: "Concepts",
    href: "/docs/how-it-works",
    text: "no model calls deterministic rules offline no telemetry no accounts no code execution privacy",
  },

  // ── Sectors ───────────────────────────────────────────────────────────────
  {
    id: "sectors",
    title: "The five sectors",
    section: "Concepts",
    href: "/docs/sectors",
    text: "five sectors damage map security trust usage accessibility dependability radar shape",
  },
  {
    id: "sectors-security",
    title: "Security sector",
    section: "Concepts",
    href: "/docs/sectors",
    text: "security wrong people get in data leak secrets injection auth surface dangerous code",
  },
  {
    id: "sectors-trust",
    title: "Trust sector",
    section: "Concepts",
    href: "/docs/sectors",
    text: "trust believe the data prove who did what schema exposed secrets auditability tenant isolation",
  },
  {
    id: "sectors-usage",
    title: "Usage sector",
    section: "Concepts",
    href: "/docs/sectors",
    text: "usage keep working for everyone infrastructure large diffs 3am pages outage",
  },
  {
    id: "sectors-a11y",
    title: "Accessibility sector",
    section: "Concepts",
    href: "/docs/sectors",
    text: "accessibility keyboard screen reader focus outlines blocked zoom unclickable never measured",
  },
  {
    id: "sectors-dep",
    title: "Dependability sector",
    section: "Concepts",
    href: "/docs/sectors",
    text: "dependability rely over time updates crashes rollbacks dependency lockfile schema",
  },
  {
    id: "sectors-radar",
    title: "Reading the radar",
    section: "Concepts",
    href: "/docs/sectors",
    text: "reading the radar axis outer ring spike severity versus sector how to read",
  },

  // ── Web app ───────────────────────────────────────────────────────────────
  {
    id: "web",
    title: "The web app",
    section: "Platform",
    href: "/docs/web",
    text: "web app browser paste report damage map radar bars heat grid sign receipt normies no terminal",
  },
  {
    id: "web-verdict",
    title: "What the numbers mean",
    section: "Platform",
    href: "/docs/web",
    text: "verdict stop fix these first check carefully a few things worth knowing looks good to go numbers",
  },
  {
    id: "web-storage",
    title: "Storage, honestly explained",
    section: "Platform",
    href: "/docs/web",
    text: "storage honestly explained public demo stateless token browser localstorage sqlite supabase postgres rls secret never stored",
  },
  {
    id: "web-a11y",
    title: "Keyboard and accessibility",
    section: "Platform",
    href: "/docs/web",
    text: "keyboard accessibility focus rings reduced motion tabular figures controls",
  },

  // ── Deployment ────────────────────────────────────────────────────────────
  {
    id: "deploy",
    title: "Deployment",
    section: "Platform",
    href: "/docs/deployment",
    text: "deployment deploy vercel supabase reference stack dual database sqlite production",
  },
  {
    id: "deploy-env",
    title: "Configure the environment",
    section: "Platform",
    href: "/docs/deployment",
    text: "environment configure dotenv approval secret signing database url file sqlite",
  },
  {
    id: "deploy-vercel",
    title: "Deploy to Vercel",
    section: "Platform",
    href: "/docs/deployment",
    text: "deploy to vercel link prod dashboard automatic deploys push main",
  },
  {
    id: "deploy-supabase",
    title: "Production storage with Supabase",
    section: "Platform",
    href: "/docs/deployment",
    text: "production storage supabase postgres migration sql sql editor row level security service role key env vars",
  },
  {
    id: "deploy-npm",
    title: "Publish the CLI to npm",
    section: "Platform",
    href: "/docs/deployment",
    text: "publish cli to npm login npm publish workspace engine package registry",
  },
  {
    id: "deploy-security",
    title: "Security checklist for production",
    section: "Platform",
    href: "/docs/deployment",
    text: "security checklist production strong approval secret gitignore sign commits rotate keys",
  },

  // ── FAQ ───────────────────────────────────────────────────────────────────
  {
    id: "faq",
    title: "FAQ",
    section: "Help",
    href: "/docs/faq",
    text: "faq frequently asked questions help answers",
  },
  {
    id: "faq-privacy",
    title: "Is my code sent anywhere?",
    section: "Help",
    href: "/docs/faq",
    text: "is my code sent anywhere privacy local offline privacy network telemetry phone home secret",
  },
  {
    id: "faq-models",
    title: "Does it need an AI model?",
    section: "Help",
    href: "/docs/faq",
    text: "does it need an ai model llm api key openai anthropic deterministic rules offline local",
  },
  {
    id: "faq-agents",
    title: "Which coding agents does it work with?",
    section: "Help",
    href: "/docs/faq",
    text: "which coding agents works with opencode claude code cursor copilot aider any agent diff paste",
  },
  {
    id: "faq-pricing",
    title: "Is it free? What is the license?",
    section: "Help",
    href: "/docs/faq",
    text: "free price cost license mit open source paid seats subscription billing",
  },
  {
    id: "faq-vs-coderabbit",
    title: "How is this different from CodeRabbit?",
    section: "Help",
    href: "/docs/faq",
    text: "different from coderabbit copilot review pr-agent comparison local first pre-push vs pull request",
  },
  {
    id: "faq-disagree",
    title: "What if I disagree with a finding?",
    section: "Help",
    href: "/docs/faq",
    text: "disagree with a finding false positive dismiss ignore approve anyway reasoning severity",
  },
  {
    id: "faq-replace",
    title: "Does it replace tests or CI?",
    section: "Help",
    href: "/docs/faq",
    text: "replace tests ci linters complement complement not replace security review before tests",
  },
  {
    id: "faq-ci",
    title: "Can I run it in CI?",
    section: "Help",
    href: "/docs/faq",
    text: "run in ci github actions pipeline server headless non interactive format json exit code",
  },
  {
    id: "faq-canary",
    title: "Why is it called canary?",
    section: "Help",
    href: "/docs/faq",
    text: "why called canary coal mine early warning bird name origin",
  },
  {
    id: "faq-who",
    title: "Who builds it?",
    section: "Help",
    href: "/docs/faq",
    text: "who builds it zabibu technika tehillah kachila company credit contribute github",
  },
];

export type DocSearchResult = DocEntry & { score: number };

/** Ranked substring search across title, section, and keywords. */
export function searchDocs(query: string, limit = 8): DocSearchResult[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const words = term.split(/\s+/).filter(Boolean);

  const scored: DocSearchResult[] = [];
  for (const entry of DOC_INDEX) {
    const title = entry.title.toLowerCase();
    const hay = `${title} ${entry.section.toLowerCase()} ${entry.text}`;
    if (!words.every((w) => hay.includes(w))) continue;

    let score = 0;
    if (title === term) score += 100;
    if (title.startsWith(term)) score += 40;
    if (title.includes(term)) score += 20;
    for (const w of words) if (title.includes(w)) score += 6;
    score += Math.max(0, 12 - entry.title.length / 8);
    scored.push({ ...entry, score });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
