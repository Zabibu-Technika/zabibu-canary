// Comparison data for /alternatives.
//
// Rules this file follows, because the pages that read it make claims about
// other people's products:
//
//   1. Every statement about a competitor traces to their own documentation,
//      linked in `sources`, with the date we checked it.
//   2. `whereTheyWin` is required and is not decoration. A comparison that marks
//      a real product "—" on every row is an advert, and readers check.
//   3. Nothing subjective ("better reports", "easier to use"). If it cannot be
//      read off a feature list, it does not go in.
//   4. CANARY_LIMITS says where WE lose, on every page, in the same words.

export type DifferenceRow = { feature: string; them: string; us: string };

export type Competitor = {
  slug: string;
  name: string;
  vendor: string;
  vendorUrl: string;
  licence: string;
  what: string;
  whereTheyWin: string[];
  differences: DifferenceRow[];
  sources: { label: string; url: string }[];
  checked: string;
};

// True of Canary in every one of these comparisons. Repeating it on each page is
// the point: a reader arriving from search should not have to find the hub page
// to learn the tool's limits.
export const CANARY_LIMITS: string[] = [
  "Canary reviews the diff you hand it, not the whole repository. It cannot reason about code a change touches but does not modify.",
  "It does not post review comments, and there is no IDE extension and no one-click fix.",
  "It matches patterns — secrets, schema changes, auth surface, dependency drift, accessibility regressions, scope creep. It is not a semantic reviewer, and it will not tell you that an algorithm is wrong.",
];

export const COMPETITORS: Competitor[] = [
  {
    slug: "coderabbit",
    name: "CodeRabbit",
    vendor: "CodeRabbit",
    vendorUrl: "https://www.coderabbit.ai",
    licence: "Proprietary, with a free tier",
    what: "An AI code review service. It reviews pull requests in the cloud, and ships a CLI and IDE extensions that review local changes before you push.",
    whereTheyWin: [
      "Full-repository context — it reads the whole codebase, not just the diff, so it can reason about code the change touches without modifying it.",
      "One-click fixes and a conversational interface on the pull request.",
      "Wide integration surface: GitHub, GitLab, Bitbucket, Azure DevOps and IDE extensions.",
      "It reviews the pull request itself, after the branch exists — which is the right place for review comments and discussion.",
    ],
    differences: [
      {
        feature: "Where it runs",
        them: "A cloud AI service. The review itself runs on CodeRabbit's servers.",
        us: "Entirely on your machine. There is no networking code in the package.",
      },
      {
        feature: "Same diff, same report",
        them: "Not guaranteed — it is a language model.",
        us: "Guaranteed — deterministic rules.",
      },
      {
        feature: "Account required",
        them: "Yes, for the service and its rate limits.",
        us: "No account, no API key.",
      },
      {
        feature: "Approval record",
        them: "Review comments on the pull request.",
        us: "An Ed25519-signed receipt in a hash-chained ledger, verifiable offline by a third party.",
      },
      {
        feature: "Licence",
        them: "Proprietary.",
        us: "MIT — free to use, modify and self-host.",
      },
    ],
    sources: [
      { label: "CodeRabbit CLI", url: "https://www.coderabbit.ai/cli" },
      { label: "CodeRabbit docs — IDE and CLI review", url: "https://docs.coderabbit.ai/overview/ide-cli-review" },
      { label: "CodeRabbit pricing", url: "https://www.coderabbit.ai/pricing" },
    ],
    checked: "October 2026",
  },
  {
    slug: "copilot-code-review",
    name: "GitHub Copilot code review",
    vendor: "GitHub",
    vendorUrl: "https://github.com",
    licence: "Proprietary and paid",
    what: "A code review feature inside GitHub pull requests. It leaves comments and suggested changes directly on the PR.",
    whereTheyWin: [
      "It lives where the pull request already is. No extra tool to install and no extra step in the workflow.",
      "Full repository and pull-request context, with suggested changes you can commit from the GitHub UI.",
      "Enterprise controls — SSO, audit logs and policy — that a large organisation already has in place.",
    ],
    differences: [
      {
        feature: "Where it runs",
        them: "GitHub's cloud, on an open pull request.",
        us: "Your machine, before the commit is pushed.",
      },
      {
        feature: "Same diff, same report",
        them: "Not guaranteed — it is a language model.",
        us: "Guaranteed — deterministic rules.",
      },
      {
        feature: "Cost and access",
        them: "A GitHub plan with Copilot, per seat.",
        us: "Free and MIT licensed. No account.",
      },
      {
        feature: "Approval record",
        them: "Review comments on the pull request.",
        us: "An Ed25519-signed receipt in a hash-chained ledger, verifiable offline.",
      },
    ],
    sources: [
      { label: "GitHub docs — Copilot code review", url: "https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review" },
      { label: "GitHub Copilot plans", url: "https://github.com/features/copilot/plans" },
    ],
    checked: "October 2026",
  },
  {
    slug: "pr-agent",
    name: "PR-Agent",
    vendor: "The-PR-Agent community (originally built at Qodo)",
    vendorUrl: "https://github.com/The-PR-Agent/pr-agent",
    licence: "Apache-2.0",
    what: "An open-source AI pull-request reviewer. It runs as a CLI or a service you host yourself, and calls an LLM provider you choose.",
    whereTheyWin: [
      "Fully self-hostable — the only tool on this page you can run entirely on your own infrastructure, down to the model.",
      "Apache-2.0 and community-governed, so you can fork it and change anything.",
      "Command-driven on the pull request (/review, /improve, /describe) across many git providers.",
      "Point it at a local model and your code need never leave your network at all.",
    ],
    differences: [
      {
        feature: "Model in the core path",
        them: "Yes — it needs an LLM, either a hosted API key or a model you run yourself.",
        us: "None. The engine is rules, so there is nothing to configure or pay for.",
      },
      {
        feature: "Same diff, same report",
        them: "Not guaranteed — the model may answer differently each run.",
        us: "Guaranteed.",
      },
      {
        feature: "Setup",
        them: "Host a service and choose, run and pay for a model.",
        us: "npm install -g zabibucanary. That is the whole setup.",
      },
      {
        feature: "Approval record",
        them: "Comments and artefacts on the pull request and its repository.",
        us: "An Ed25519-signed receipt in a hash-chained ledger, verifiable offline.",
      },
    ],
    sources: [
      { label: "PR-Agent on GitHub", url: "https://github.com/The-PR-Agent/pr-agent" },
      { label: "Qodo — handing PR-Agent to the community (licence back to Apache-2.0)", url: "https://www.qodo.ai/blog/qodo-is-handing-pr-agent-over-to-the-community/" },
    ],
    checked: "October 2026",
  },
];

export function competitor(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}
