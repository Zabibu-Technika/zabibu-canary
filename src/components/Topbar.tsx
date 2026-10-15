"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CanaryLogo } from "@/components/CanaryLogo";

export function Topbar() {
  const pathname = usePathname();
  const onDocs = pathname.startsWith("/docs");
  // On the home page the install section is a local anchor; elsewhere, jump back to it.
  const installHref = pathname === "/" ? "#install" : "/#install";

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <CanaryLogo size={24} />
        zabibu canary
      </Link>
      <nav className="topnav" aria-label="Primary">
        <Link href={installHref} className="topnav-link">
          install
        </Link>
        <Link
          href="/docs"
          className={`topnav-link${onDocs ? " active" : ""}`}
          aria-current={onDocs ? "page" : undefined}
        >
          docs
        </Link>
        <a
          className="topnav-link"
          href="https://github.com/Zabibu-Technika/zabibu-canary"
          target="_blank"
          rel="noreferrer"
        >
          github
          <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}
