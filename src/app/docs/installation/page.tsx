import type { Metadata } from "next";
import { routeMetadata } from "@/lib/routes";

export const metadata: Metadata = routeMetadata("/docs/installation");

export default function DocsInstallation() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary install</p>
      <h1>Installation</h1>
      <p className="docs-lede">
        Four ways in. All of them end with a working <code className="file-path">zabibucanary</code>{" "}
        command on your PATH.
      </p>

      <h2>Requirements</h2>
      <ul className="docs-list">
        <li>Node.js 22.6 or newer (the range these packages declare in{" "}<code className="file-path">engines</code>)</li>
        <li>git — for reviewing diffs and installing hooks</li>
        <li>No accounts, no API keys, no cloud. Everything runs locally.</li>
      </ul>

      <h2>Option 1 — the install script</h2>
      <pre className="docs-pre">curl -fsSL https://zabibucanary.vercel.app/install | bash</pre>
      <p>
        Tries the npm package first and falls back to a source install automatically. Prints an{" "}
        <code className="file-path">ok</code> line for each step, then the two commands to try next.
      </p>

      <h2>Option 2 — npm</h2>
      <pre className="docs-pre">npm install -g zabibucanary</pre>
      <p>
        Published as <code className="file-path">zabibucanary</code> on npm. The shared engine
        installs alongside it as <code className="file-path">zabibucanary-engine</code>.
      </p>

      <h2>Option 3 — from source</h2>
      <pre className="docs-pre">{`git clone https://github.com/Zabibu-Technika/zabibu-canary.git
cd zabibu-canary
npm install
npm link -w cli`}</pre>
      <p>
        Keep the cloned folder — the linked command resolves its dependencies from it.
      </p>

      <h2>Option 4 — one-off run</h2>
      <pre className="docs-pre">npx --yes zabibucanary demo</pre>
      <p>
        Runs the published package without a global install — handy for trying it in CI or a scratch
        environment.
      </p>

      <h2>Verify the install</h2>
      <pre className="docs-pre">{`$ zabibucanary --version
0.1.0

$ zabibucanary demo
risk 100/100 · grade E · Stop — fix these first ...`}</pre>

      <h2>Your first review</h2>
      <pre className="docs-pre">{`cd any-git-repo
# make some changes, then:
zabibucanary review`}</pre>
      <p>
        Press <code className="file-path">a</code> to sign an approval receipt,{" "}
        <code className="file-path">q</code> to quit. Exit code is 0 when clean or approved,
        1 when critical findings are unapproved — so CI and hooks can gate on it.
      </p>

      <h2>Uninstalling</h2>
      <pre className="docs-pre">{`npm uninstall -g zabibucanary        # for npm installs
zabibucanary hook remove             # in each repo you gated`}</pre>
      <p>Your receipts live at <code className="file-path">~/.zabibucanary/ledger.jsonl</code> and are never removed automatically.</p>
    </>
  );
}
