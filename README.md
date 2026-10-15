# GroundTruth

**The safety check for AI-made changes — in plain English.**

Your AI wrote the code. But what could go wrong? Paste anything your AI gave
you — code, changes, notes — and GroundTruth tells you, in words anyone can
understand, what risks are hiding in it before it goes live. Then approve with
one click and get a tamper-proof receipt proving a human said yes.

For developers: it parses unified diffs, scores blast radius across schema /
auth / secrets / dependencies / infrastructure, and signs approvals into an
HMAC hash-chained ledger — a compliance artifact for EU AI Act Article 14
(human oversight), SOC 2, and SOX.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:3000
```

No env setup needed for local dev. Click **Run demo analysis** on the dashboard
to see the engine against a realistic risky diff.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` / `npm start` | Production build & serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Engine + ledger unit tests (node:test) |

## How it works

- **Engine** (`src/lib/server/analyze.ts`) — pure diff parser + risk detectors.
  No I/O; fully unit-tested.
- **Ledger** (`src/lib/server/ledger.ts`) — HMAC-SHA256 hash chain over
  `(analysisId, signer, signedAt)` with the previous signature as the chain
  link. Tampering with any record invalidates every later signature.
- **Store** (`src/lib/server/store.ts`) — dual-database by design:
  - dev: `DATABASE_URL=file:./data/groundtruth.db` → built-in `node:sqlite`
    (zero dependencies)
  - prod: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` → Supabase REST
    (schema in `supabase/migrations/0001_init.sql`, RLS enabled)

## Security model

- All API input validated with Zod.
- Secrets never enter the database or logs; the analysis engine flags them in
  diffs instead of storing their values.
- `.env` is git-ignored; `.env.example` carries placeholders only.
- The approval chain verifies on every detail-page load and displays the
  verification result.

## Roadmap

- GitHub App / PR integration (analyze at PR open, block merge without signature)
-SARIF export for enterprise scanners
- SSO + team policies (who may sign which risk grades)
