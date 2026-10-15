import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Topbar } from "@/components/Topbar";
import { DocsNav } from "@/components/DocsNav";
import { DocsSearch } from "@/components/DocsSearch";

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
      <Topbar />
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <DocsSearch />
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
