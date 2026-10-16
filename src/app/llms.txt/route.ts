import { PUBLIC_ROUTES } from "@/lib/routes";
import { SITE, absolute } from "@/lib/site";
import { faqAsText } from "@/lib/jsonld";

// Served at /llms.txt — the plain-text brief for language models and agents.
//
// It is the same story the landing page tells, in the shape an answer engine
// prefers: a summary it can quote, then links. Nothing here is hidden from a
// human reader, and nothing here is stated that the repo does not back up.
export const dynamic = "force-static";

function bullet(path: string): string {
  const route = PUBLIC_ROUTES.find((r) => r.path === path);
  return route ? `- [${route.title}](${absolute(route.path)}): ${route.description}` : "";
}

export function GET(): Response {
  const docs = PUBLIC_ROUTES.filter((r) => r.path.startsWith("/docs"))
    .map((r) => bullet(r.path))
    .join("\n");
  const alternatives = PUBLIC_ROUTES.filter((r) => r.path.startsWith("/alternatives"))
    .map((r) => bullet(r.path))
    .join("\n");
  // The first few FAQ answers verbatim — the ones a reader is most likely to be
  // asked about, and the ones with the least room for paraphrase.
  const qa = faqAsText()
    .slice(0, 6)
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const body = `# ${SITE.name}

> ${SITE.shortDescription}

${SITE.description}

A ${SITE.org.name} product, built by ${SITE.author.name}. MIT licensed. Source: ${SITE.repo}

## Quick facts
- Name: ${SITE.name} (lowercase: "${SITE.wordmark}")
- Tagline: ${SITE.tagline}
- Category: local-first code review and change-control tooling for AI-generated code
- Runs: CLI in a terminal, and a browser app using the same engine
- Licence: ${SITE.license} — free to use, modify and self-host
- Version: ${SITE.version}
- Node: 22.6 or newer
- Cost: none. No account, no API key, no subscription, no telemetry.

## What it does
- Reviews a git diff, a working tree, or a code block pasted from an AI tool.
- Reports risk in plain English, with a suggested fix for each finding.
- Maps impact across five sectors: usage, trust, accessibility, security, dependability.
- Gates a git push, blocking unapproved critical findings.
- Records approvals in a hash-chained ledger signed with Ed25519.
- Exports a self-contained evidence bundle a third party can verify offline.

## What it is not
- It does not call a language model in its core path. The engine is deterministic
  rules, so the same diff produces the same report every time, on any machine.
- It is not a certification and does not claim to satisfy SOC 2, the EU AI Act or
  any other framework. It produces one honest input to change-management evidence.
- It does not replace tests or CI. It runs before them.

## Docs
${docs}

## Comparisons
${alternatives}

## Install
- npm: ${SITE.install}
- One-off without installing: npx --yes zabibucanary demo
- CLI package: ${SITE.npm.cli}
- Engine package: ${SITE.npm.engine}
- Source: ${SITE.repo}
- Site: ${SITE.url}

## FAQ
${qa}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
