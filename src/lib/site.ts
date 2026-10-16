// Single source of truth for identity and canonical URLs. Metadata, JSON-LD,
// the sitemap, llms.txt and the IndexNow payload all read from here, so they can
// never disagree about who we are or where we live.

export const SITE = {
  url: "https://zabibucanary.vercel.app",
  name: "Zabibu Canary",
  wordmark: "zabibu canary",
  tagline: "the early-warning system for AI-made changes",
  shortDescription:
    "Local-first code review for AI-made changes — plain-English risk reports, five-sector damage maps, and Ed25519-signed approval receipts anyone can verify.",
  description:
    "Every line your coding agent writes, reviewed before it ships. Plain-English risk, five-sector damage maps, and a signed receipt anyone can verify. A Zabibu Technika product, built by Tehillah Kachila.",
  version: "0.1.0", // keep in sync with cli/package.json
  license: "MIT",
  repo: "https://github.com/Zabibu-Technika/zabibu-canary",
  issues: "https://github.com/Zabibu-Technika/zabibu-canary/issues",
  npm: {
    cli: "https://www.npmjs.com/package/zabibucanary",
    engine: "https://www.npmjs.com/package/zabibucanary-engine",
  },
  install: "npm install -g zabibucanary",
  org: {
    name: "Zabibu Technika",
    url: "https://zabibu.vercel.app",
    tagline: "software that breathes",
  },
  author: {
    name: "Tehillah Kachila",
    url: "https://github.com/teh317",
  },
  // IndexNow ownership proof. The file served at /<key>.txt must contain exactly
  // this value or the ping is rejected — see src/app/api/indexnow/route.ts.
  indexNowKey: "7b46d66f920388799ffd0c3d3f2abbff",
  // Bumped by hand when page copy changes. Deliberately NOT `new Date()` — a
  // lastmod that moves on every request is a signal search engines learn to ignore.
  contentUpdated: "2026-10-16",
} as const;

/** Resolve a site-relative path to the absolute canonical URL. */
export function absolute(path: string): string {
  return new URL(path, SITE.url).toString();
}
