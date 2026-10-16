import Link from "next/link";
import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { Comparison } from "@/components/Comparison";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, schemaGraph } from "@/lib/jsonld";
import { CANARY_LIMITS, COMPETITORS } from "@/lib/competitors";
import { routeMetadata } from "@/lib/routes";

export const metadata: Metadata = routeMetadata("/alternatives");

export default function AlternativesPage() {
  return (
    <main className="app-shell">
      <Topbar />
      <JsonLd
        id="crumbs"
        data={schemaGraph(
          breadcrumbSchema([
            { name: "zabibu canary", path: "/" },
            { name: "alternatives", path: "/alternatives" },
          ]),
        )}
      />

      <section className="card">
        <p className="docs-eyebrow">man canary alternatives</p>
        <h1>How zabibu canary compares</h1>
        <p className="lede">
          Canary is not the only way to review code an agent wrote, and it is not the right tool for
          every job. Below is an honest feature comparison, and a link to a longer write-up for each
          tool that includes where that tool is the better choice.
        </p>
        <Comparison />
      </section>

      <section>
        <h2>The detailed write-ups</h2>
        <ul className="docs-list">
          {COMPETITORS.map((c) => (
            <li key={c.slug}>
              <Link href={`/alternatives/${c.slug}`}>zabibu canary vs {c.name}</Link> — {c.what}{" "}
              <span className="helper">(licence: {c.licence})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Where Canary is not the better tool</h2>
        <p className="helper" style={{ marginBottom: 10 }}>
          The same list appears on every comparison page. If any of these matter more to you than what
          Canary does, use one of the tools above instead.
        </p>
        <ul className="docs-list">
          {CANARY_LIMITS.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Use them together</h2>
        <p className="helper">
          These are complements. Gate locally with Canary before the code leaves your machine, then let
          a cloud reviewer with full-repository context look at the pull request.{" "}
          <Link href="/#install">Install Canary</Link>.
        </p>
      </section>

      <p className="credit">
        <strong>zabibu canary</strong> — a{" "}
        <a href="https://zabibu.vercel.app" target="_blank" rel="noreferrer">
          Zabibu Technika
        </a>{" "}
        product · built by Tehillah Kachila
      </p>
    </main>
  );
}
