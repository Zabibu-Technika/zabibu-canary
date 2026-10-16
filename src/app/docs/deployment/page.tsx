import type { Metadata } from "next";
import { routeMetadata } from "@/lib/routes";

export const metadata: Metadata = routeMetadata("/docs/deployment");

export default function DocsDeployment() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary deploy</p>
      <h1>Deployment</h1>
      <p className="docs-lede">
        The reference stack: Vercel + Supabase. The app is dual-database by design — local SQLite
        in development, Supabase in production, chosen by environment.
      </p>

      <h2>1. Get the code</h2>
      <pre className="docs-pre">{`git clone https://github.com/Zabibu-Technika/zabibu-canary.git
cd zabibu-canary
npm install`}</pre>

      <h2>2. Configure the environment</h2>
      <pre className="docs-pre">{`# .env (development)
TOKEN_SECRET=any-dev-secret
DATABASE_URL=file:./data/groundtruth.db`}</pre>
      <p>
        <code className="file-path">TOKEN_SECRET</code> signs the stateless demo tokens — symmetric on
        purpose, because both ends are us. <code className="file-path">DATABASE_URL</code> selects the
        local SQLite store.
      </p>
      <p>
        Receipts are a different matter: they are signed with an Ed25519 key, so verification needs the
        matching public key. In the CLI that key is yours and never moves. A server deployment has no
        such luxury — set both variables, or accept that receipts stop verifying when the process
        restarts:
      </p>
      <pre className="docs-pre">{`npx vercel env add ZABIBU_SIGNING_KEY production
npx vercel env add ZABIBU_VERIFY_KEY production`}</pre>

      <h2>3. Deploy to Vercel</h2>
      <pre className="docs-pre">{`npm i -g vercel
vercel login
vercel link
vercel --prod`}</pre>
      <p>
        Or connect the GitHub repo in the Vercel dashboard for automatic deploys on every push to{" "}
        <code className="file-path">main</code>. Production URL:{" "}
        <code className="file-path">zabibucanary.vercel.app</code>.
      </p>

      <h2>4. Production storage (Supabase)</h2>
      <ol className="steps">
        <li className="step">
          <span className="step-num">1</span>
          <div>Create a project at supabase.com.</div>
        </li>
        <li className="step">
          <span className="step-num">2</span>
          <div>Run <code className="file-path">supabase/migrations/0001_init.sql</code> in the SQL editor — creates the tables with row-level security enabled.</div>
        </li>
        <li className="step">
          <span className="step-num">3</span>
          <div>Add the variables to Vercel (they stay out of the repo):</div>
        </li>
      </ol>
      <pre className="docs-pre">{`npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
npx vercel --prod`}</pre>
      <p>
        The store prefers Supabase automatically when those variables are present — no other change
        needed. The service-role key is used server-side only and never sent to the browser.
      </p>

      <h2>5. Publish the CLI to npm</h2>
      <pre className="docs-pre">{`npm login
npm publish --workspace packages/engine      # the shared engine first
npm publish --workspace cli                  # the zabibucanary CLI`}</pre>
      <p>
        Both packages ship MIT-licensed with publish metadata already prepared. Once the CLI is on
        npm, the install tabs on the website and the <code className="file-path">/install</code>{" "}
        script resolve to it directly.
      </p>

      <h2>Self-hosting anywhere else</h2>
      <p>
        Any Node 22+ host works: <code className="file-path">npm run build &amp;&amp; npm start</code>.
        For persistent storage without Supabase, point{" "}
        <code className="file-path">DATABASE_URL</code> at a <code className="file-path">file:</code>{" "}
        path on a mounted volume.
      </p>

      <h2>Security checklist for production</h2>
      <ul className="docs-list">
        <li>Real Ed25519 keys in <code className="file-path">ZABIBU_SIGNING_KEY</code> / <code className="file-path">ZABIBU_VERIFY_KEY</code> — the private key is the ledger&apos;s root of trust, so keep it out of the repo and rotate it on exposure</li>
        <li><code className="file-path">TOKEN_SECRET</code> and <code className="file-path">INDEXNOW_SECRET</code> set to real random values — without the first, demo tokens fall back to a default published in this repo and become forgeable; without the second, anyone can make your deployment ping IndexNow</li>
        <li><code className="file-path">.env</code> never committed — <code className="file-path">.gitignore</code> covers it</li>
        <li>Sign your commits (<code className="file-path">git config user.signingkey</code>)</li>
        <li>Rotate any key that was ever committed — the engine flags them for a reason</li>
      </ul>
    </>
  );
}
