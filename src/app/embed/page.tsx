import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { routeMetadata } from "@/lib/routes";
import { SITE, absolute } from "@/lib/site";

export const metadata: Metadata = routeMetadata("/embed");

const BADGE = absolute("/badge.svg");

const MARKDOWN = `[![reviewed with ${SITE.wordmark}](${BADGE})](${SITE.url})`;

const HTML = `<a href="${SITE.url}"><img src="${BADGE}" alt="reviewed with ${SITE.wordmark}"></a>`;

export default function EmbedPage() {
  return (
    <main className="app-shell">
      <Topbar />

      <section className="card">
        <p className="docs-eyebrow">man canary embed</p>
        <h1>Badge &amp; embed</h1>
        <p className="lede">
          If your project gates changes with Canary, say so on the README. It tells the next person
          what your review process is — and it is how anyone finds out this tool exists.
        </p>
        <p style={{ margin: "18px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/badge.svg" alt={`reviewed with ${SITE.wordmark}`} height={20} />
        </p>
      </section>

      <section className="card">
        <h2>Markdown</h2>
        <pre className="docs-pre">{MARKDOWN}</pre>

        <h2>HTML</h2>
        <pre className="docs-pre">{HTML}</pre>
      </section>

      <section className="card">
        <h2>House rules for the link</h2>
        <ul className="docs-list">
          <li>
            <strong>Keep the alt text descriptive.</strong> &ldquo;reviewed with zabibu canary&rdquo;
            is honest and readable. Do not stuff it with keywords.
          </li>
          <li>
            <strong>Link to the site, not to a tracking URL.</strong> The badge above points at{" "}
            <code className="file-path">{SITE.url}</code>. There is no query string to strip.
          </li>
          <li>
            <strong>Only show it if it is true.</strong> A badge that says a change was reviewed,
            attached to a project that does not review changes, is a lie with your name on it.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>What the badge does not do</h2>
        <p className="helper">
          It is a static SVG. No tracking pixel, no analytics, no cookie, no identifying query string
          — nothing is recorded about who viewed it. The same is true of this whole site: there is no
          client-side analytics, and the only database is the one that stores the reviews you
          explicitly run here.
        </p>
      </section>

      <section>
        <h2>Also useful</h2>
        <ul className="docs-list">
          <li>
            <a href={SITE.repo} target="_blank" rel="noreferrer">
              Star the repository
            </a>{" "}
            — the honest signal that this is worth maintaining.
          </li>
          <li>
            <a href={SITE.npm.cli} target="_blank" rel="noreferrer">
              The CLI on npm
            </a>{" "}
            — installs count too.
          </li>
        </ul>
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
