import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, schemaGraph, softwareApplicationSchema, webSiteSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  // metadataBase makes every relative URL below resolvable to an absolute one —
  // canonical tags and OG images need absolute URLs, not paths.
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.wordmark} — ${SITE.tagline}`,
    template: `%s · ${SITE.wordmark}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author.name, url: SITE.author.url }],
  creator: SITE.author.name,
  publisher: SITE.org.name,
  category: "SoftwareApplication",
  keywords: [
    "AI code review",
    "local-first code review",
    "pre-push hook",
    "AI-generated code",
    "change control",
    "audit trail",
    "signed approval receipt",
    "Ed25519 signatures",
    "CodeRabbit alternative",
    "GitHub Copilot code review alternative",
  ],
  // Every page overrides this via routeMetadata(); this is the "/" default.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.wordmark} — ${SITE.tagline}`,
    description: SITE.shortDescription,
    locale: "en_US",
  },
  // "summary", not "summary_large_image": we ship no OG image, and a card that
  // promises a big image it does not have renders worse than the small one.
  twitter: {
    card: "summary",
    title: `${SITE.wordmark} — ${SITE.tagline}`,
    description: SITE.shortDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Site-wide entities. Page-specific graphs (FAQPage, BreadcrumbList)
            render inside the pages themselves. */}
        <JsonLd
          id="site-graph"
          data={schemaGraph(organizationSchema(), webSiteSchema(), softwareApplicationSchema())}
        />
        {children}
        {/* CRT scanlines — decorative, ignores the pointer */}
        <div className="scanlines" aria-hidden="true" />
      </body>
    </html>
  );
}
