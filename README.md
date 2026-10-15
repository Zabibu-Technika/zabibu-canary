# zabibu canary

**The safety check for AI-made changes — in plain English, in your terminal or browser.**

Your AI wrote the code. But what could go wrong? Paste anything your AI gave you — code,
changes, notes — and Zabibu Canary tells you, in words anyone can understand, what risks are
hiding in it before it goes live. Then approve with one click and get a tamper-proof receipt
proving a human said yes.

**A Zabibu Technika product · built by Tehillah Kachila.**

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
# run from this repo (no install)
npx tsx cli/src/index.tsx demo

# or link the bin for this session
npm link --workspace cli
zabibu demo
zabibu review                 # review staged changes (or the working tree)
zabibu review --watch         # re-review automatically as files change
zabibu review --format json   # machine output for CI
zabibu review --format github # ::error / ::warning annotations for GitHub Actions
zabibu hook install           # pre-push gate: blocks risky pushes without a signed approval
zabibu hook remove
```

Install globally for real use: `npm install -g zabibu-canary` (after publishing), then
`zabibu review` in any repo.

### How the local approval loop works

Each review is identified by a hash of the exact diff. Approving in the TUI (`a`) records an
HMAC-signed approval in `~/.zabibu-canary/ledger.jsonl` — the same hash-chain construction as
the web app. Re-running the same diff (including from the installed git hook) sees the existing
receipt and passes. Escape hatch: `CANARY_ACK=1` overrides the gate.

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
- **Ledger**: HMAC-SHA256 hash chain over `(analysisId, signer, signedAt)`. Tampering with any
  record invalidates every later signature.
- **Storage**: dual-database by design — local `node:sqlite` in dev (zero dependencies),
  Supabase REST in production (`supabase/migrations/0001_init.sql`, RLS enabled).

## Security model

- All API input validated with Zod; secret values are flagged, never stored.
- `.env` is git-ignored; `.env.example` carries placeholders only.
- Commits and tags should be signed (see `git config user.signingkey`) before public release.

## Deploy

Production target: **Vercel** (auto-deploys on push to `main`).
Repo: **github.com/Zabibu-Technika/zabibu-canary** (private).
Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in Vercel env for persistent storage.
