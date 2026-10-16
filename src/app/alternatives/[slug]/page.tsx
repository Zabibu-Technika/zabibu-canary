import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, schemaGraph } from "@/lib/jsonld";
import { CANARY_LIMITS, COMPETITORS, competitor } from "@/lib/competitors";
import { routeMetadata } from "@/lib/routes";

// One static page per competitor, prerendered. Nothing here is generated at
// request time, so the crawler gets the whole comparison, not a shell.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return competitor(slug) ? routeMetadata(`/alternatives/${slug}`) : {};
}

export default async function CompetitorPage({ params }: Params) {
  const { slug } = await params;
  const c = competitor(slug);
  if (!c) notFound();

  const others = COMPETITORS.filter((x) => x.slug !== c.slug);

  return (
    <main className="app-shell">
      <Topbar />
      <JsonLd
        id="crumbs"
        data={schemaGraph(
          breadcrumbSchema([
            { name: "zabibu canary", path: "/" },
            { name: "alternatives", path: "/alternatives" },
            { name: c.name, path: `/alternatives/${c.slug}` },
          ]),
        )}
      />

      <section className="card">
        <p className="docs-eyebrow">man canary vs {c.slug}</p>
        <h1>
          zabibu canary vs {c.name}
        </h1>
        <p className="lede">{c.what}</p>
        <p className="helper">
          {c.vendor} ·{" "}
          <a href={c.vendorUrl} target="_blank" rel="noreferrer">
            {new URL(c.vendorUrl).host}
          </a>{" "}
          · licence: {c.licence}
        </p>
      </section>

      <section className="card">
        <h2>Where {c.name} wins</h2>
        <p className="helper" style={{ marginBottom: 10 }}>
          If any of these is what you actually need, use {c.name}. This section is not decoration.
        </p>
        <ul className="docs-list">
          {c.whereTheyWin.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Feature by feature</h2>
        <div className="compare-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th>Capability</th>
                <th>{c.name}</th>
                <th className="compare-us">zabibu canary</th>
              </tr>
            </thead>
            <tbody>
              {c.differences.map((row) => (
                <tr key={row.feature}>
                  <td>{row.feature}</td>
                  <td>{row.them}</td>
                  <td className="compare-us">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Where Canary is not the better tool</h2>
        <ul className="docs-list">
          {CANARY_LIMITS.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Sources</h2>
        <p className="helper">
          Every claim about {c.name} above comes from the vendor&apos;s own documentation. Checked{" "}
          {c.checked}; links kept here so you can re-check them.
        </p>
        <ul className="docs-list">
          {c.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Install Canary</h2>
        <pre className="docs-pre">npm install -g zabibucanary</pre>
        <p className="helper">
          Free, MIT licensed, no account and no API key. Also see the other comparisons:{" "}
          {others.map((o, i) => (
            <span key={o.slug}>
              <Link href={`/alternatives/${o.slug}`}>{o.name}</Link>
              {i < others.length - 1 ? ", " : "."}
            </span>
          ))}
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
