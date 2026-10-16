import { FAQ_ITEMS } from "@/components/Faq";
import { SITE, absolute } from "./site";

// Schema.org graph builders. Everything is derived from SITE + the real FAQ
// content, so the markup cannot drift from the page it describes. No invented
// ratings, review counts, prices or awards — structured data that doesn't match
// visible content is the thing that earns a manual action.

type SchemaNode = Record<string, unknown>;

/** Flatten a React element tree to plain text, for schema fields that need a string. */
function textOf(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in (node as { props?: unknown })) {
    return textOf((node as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}

const squash = (s: string) => s.replace(/\s+/g, " ").trim();

/** The FAQ as plain question/answer strings — single source is components/Faq.tsx. */
export function faqAsText(): { question: string; answer: string }[] {
  return FAQ_ITEMS.map((item) => ({
    question: squash(item.q),
    answer: squash(textOf(item.a)),
  }));
}

export function organizationSchema(): SchemaNode {
  return {
    "@type": "Organization",
    "@id": `${SITE.org.url}/#organization`,
    name: SITE.org.name,
    url: SITE.org.url,
    slogan: SITE.org.tagline,
    founder: { "@type": "Person", name: SITE.author.name },
  };
}

export function webSiteSchema(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.wordmark,
    description: SITE.shortDescription,
    inLanguage: "en",
    publisher: { "@id": `${SITE.org.url}/#organization` },
  };
}

export function softwareApplicationSchema(): SchemaNode {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#software`,
    name: SITE.name,
    alternateName: SITE.wordmark,
    description: SITE.shortDescription,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Code review",
    operatingSystem: "macOS, Windows, Linux",
    softwareVersion: SITE.version,
    programmingLanguage: "TypeScript",
    isAccessibleForFree: true,
    license: "https://opensource.org/license/mit",
    codeRepository: SITE.repo,
    downloadUrl: SITE.npm.cli,
    installUrl: SITE.npm.cli,
    url: SITE.url,
    author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
    publisher: { "@id": `${SITE.org.url}/#organization` },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    // Only capabilities that are actually shipped and publicly verifiable in the
    // repo — no roadmap items dressed up as features.
    featureList: [
      "Local pre-push review gate — diffs never leave the machine",
      "Plain-English risk findings with a fix for each",
      "Five-sector impact map: usage, trust, accessibility, security, dependability",
      "Tamper-evident signed approval receipts in a hash-chained ledger",
      "Deterministic engine — no model calls, no API keys, works offline",
      "Machine-readable output for CI (--format json, --format github)",
      "MIT licensed and self-hostable",
    ],
  };
}

export function faqPageSchema(): SchemaNode {
  return {
    "@type": "FAQPage",
    "@id": `${SITE.url}/#faq`,
    mainEntity: faqAsText().map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: absolute(step.path),
    })),
  };
}

/** Wrap nodes in a single @graph document. */
export function schemaGraph(...nodes: SchemaNode[]): SchemaNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
