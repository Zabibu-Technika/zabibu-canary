"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Getting started",
    items: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/installation", label: "Installation" },
    ],
  },
  {
    title: "CLI",
    items: [
      { href: "/docs/commands", label: "Command reference" },
      { href: "/docs/git-hooks", label: "Git hooks & CI" },
    ],
  },
  {
    title: "Concepts",
    items: [
      { href: "/docs/how-it-works", label: "How it works" },
      { href: "/docs/sectors", label: "The five sectors" },
    ],
  },
  {
    title: "Platform",
    items: [
      { href: "/docs/web", label: "The web app" },
      { href: "/docs/deployment", label: "Deployment" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();
  return (
    <nav className="docs-nav" aria-label="Documentation">
      {SECTIONS.map((section) => (
        <div key={section.title} className="docs-nav-section">
          <h4>{section.title}</h4>
          {section.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`docs-nav-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>
                {active && <span className="term-prompt" aria-hidden="true">{">"}</span>}
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
