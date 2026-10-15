import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { CanaryLogo } from "@/components/CanaryLogo";
import { DocsNav } from "@/components/DocsNav";

export const metadata: Metadata = {
  title: {
    default: "docs — zabibu canary",
    template: "%s — zabibu canary docs",
  },
  description: "Documentation for zabibu canary — the safety check for AI-made changes.",
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="app-shell docs-shell">
      <header className="topbar">
        <Link href="/" className="brand">
          <CanaryLogo size={24} />
          zabibu canary
        </Link>
        <span className="tagline">docs</span>
      </header>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <DocsNav />
        </aside>
        <article className="docs-content">{children}</article>
      </div>
      <p className="credit">
        <strong>zabibu canary</strong> — a Zabibu Technika product · built by Tehillah Kachila
      </p>
    </main>
  );
}
