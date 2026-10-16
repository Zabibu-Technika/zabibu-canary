# zabibu canary

**The early-warning system for AI-made changes — with a signed receipt anyone can verify.**

Your AI wrote the code. But what could go wrong? Paste anything your AI gave you — code,
changes, notes — and Zabibu Canary tells you, in words anyone can understand, what risks are
hiding in it before it goes live. Then approve with one click and get a signed receipt proving a
human reviewed it — one anybody can check from your public key, without trusting your machine.

**A [Zabibu Technika](https://zabibu.vercel.app) product · built by Tehillah Kachila.**

**Live:** https://zabibucanary.vercel.app · **Docs:** https://zabibucanary.vercel.app/docs

- Web app: paste a diff, read the report, sign the receipt
- CLI (`zabibu`): the same engine, locally, with a pre-push gate — a local-first
  alternative to CodeRabbit that never sends your code anywhere
- Shared engine: identical analysis online and offline (one source of truth)

## Quickstart — web

```bash
npm install
npm run dev        # http://localhost:3000
```

No env setup for local dev. Click **Show me an example** to see the engine against a
realistic risky diff.

## Quickstart — CLI

```bash
# option 1 — the install script (works today)
curl -fsSL https://zabibucanary.vercel.app/install | bash

# option 2 — from source
git clone https://github.com/Zabibu-Technika/zabibu-canary.git
cd zabibu-canary && npm install && npm link -w cli

# then, in any repo:
zabibucanary review                 # review staged changes (or the working tree)
zabibucanary review --watch         # re-review automatically as files change
zabibucanary review --format json   # machine output for CI
zabibucanary review --format github # ::error / ::warning annotations for GitHub Actions
zabibucanary hook install           # pre-push gate: blocks risky pushes without a signed approval
zabibucanary hook remove
zabibucanary ledger                 # the local ledger: records, chain status, key fingerprint
zabibucanary ledger export > proof.json  # a self-contained, verifiable evidence bundle
zabibucanary ledger verify proof.json    # check a bundle using only the file
zabibucanary demo                   # the bundled example review
```

Or install the published CLI straight from the registry — `npm install -g zabibucanary`. The shared
analysis engine ships alongside it as
[`zabibucanary-engine`](https://www.npmjs.com/package/zabibucanary-engine), so the CLI and the
web app always apply exactly the same rules. No accounts, no API keys, nothing leaves your machine.

### How the local approval loop works

Each review is identified by a hash of the exact diff. Approving in the TUI (`a`) records an
Ed25519-signed approval in `~/.zabibucanary/ledger.jsonl`. The private key stays at
`~/.zabibucanary/approver.key` and never travels with a receipt; verification needs only the
public key, which is why somebody else can check the record without trusting the machine it came
from. Re-running the same diff (including from the installed git hook) sees the existing receipt
and passes. Escape hatch: `CANARY_ACK=1` overrides the gate.

Export the proof and verify it elsewhere — the bundle is self-contained, so this needs no access
to your machine, your repo, or this tool:

```bash
zabibucanary ledger export > canary-evidence.json
zabibucanary ledger verify canary-evidence.json   # run this anywhere
```

A signature stops edits, not deletion: whoever holds the ledger file could rebuild it. That is why
the export carries a head fingerprint (printed by `ledger export`) — anchor it somewhere you don't
control (a signed git commit, OpenTimestamps, a public log) and a wholesale rewrite becomes
detectable.

Exit codes: `0` = clean or approved, `1` = critical findings without a signed approval.

## Workspace layout

```
packages/engine/   shared analysis engine (diff parsing, risk detectors,
                   sector impact map, approval ledger) — pure, unit-tested
cli/               zabibu-canary CLI (Ink TUI + git integration)
src/               Next.js web app (App Router)
supabase/          production schema (RLS enabled)
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Web dev server on :3000 |
| `npm run build` | Production web build |
| `npm test` | All workspace tests (engine + web) |
| `npm run typecheck` | `tsc --noEmit` for the web app |

## How it works

- **Engine** (`packages/engine`): diff parser + detectors for secrets, schema, auth surfaces,
  unpinned dependencies, lockfile drift, infrastructure, accessibility regressions, and blast
  radius. Every finding maps to five damage sectors — security, trust, usage, accessibility,
  dependability — visualized as a radar, bars, and a heat grid.
- **Ledger**: Ed25519 hash chain over `(analysisId, signer, signedAt)`, signed with a private key
  that never leaves the approver's machine. Editing any record invalidates every later signature,
  and a third party can verify an exported bundle from the public key alone.
- **Storage**: dual-database by design — local `node:sqlite` in dev (zero dependencies),
  Supabase REST in production (`supabase/migrations/0001_init.sql`, RLS enabled).

## Security model

- All API input validated with Zod; secret values are flagged, never stored.
- `.env` is git-ignored; `.env.example` carries placeholders only.
- Commits and tags should be signed (see `git config user.signingkey`) before public release.

## Deploy

Production target: **Vercel** (Git integration on `main`; `npx vercel --prod` as a fallback).
Repo: **github.com/Zabibu-Technika/zabibu-canary** (public).
Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in Vercel env for persistent storage, and
`ZABIBU_SIGNING_KEY` + `ZABIBU_VERIFY_KEY` (Ed25519 PEMs) so web receipts verify across restarts
instead of being signed with an ephemeral key.

## License

MIT © Zabibu Technika (Tehillah Kachila) — see [LICENSE](LICENSE).
