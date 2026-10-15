// Dual-database store: local SQLite (dev) or Supabase REST (prod), selected by env.
import { randomUUID } from "node:crypto";
import { getDb } from "./db.ts";
import { signApproval, verifyChain, LEDGER_SEED, type ApprovalPayload } from "zabibucanary-engine";
import type { AnalysisResult, Finding } from "zabibucanary-engine";

export interface Analysis {
  id: string;
  repo: string;
  sourceKind: string;
  diff: string;
  riskScore: number;
  grade: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  createdAt: string;
}

export interface StoredFinding extends Finding {
  id: string;
  analysisId: string;
}

export interface Approval extends ApprovalPayload {
  id: string;
  prevSig: string;
  sig: string;
}

export interface AnalysisDetail {
  analysis: Analysis;
  findings: StoredFinding[];
  approvals: Approval[];
  chainValid: boolean;
}

export type SaveAnalysisInput = {
  repo: string;
  sourceKind: string;
  diff: string;
} & AnalysisResult;

interface Store {
  saveAnalysis(input: SaveAnalysisInput): Promise<Analysis>;
  listAnalyses(limit?: number): Promise<Analysis[]>;
  getAnalysisDetail(id: string): Promise<AnalysisDetail | null>;
  approve(analysisId: string, signer: string): Promise<Approval>;
}

function approvalSecret(): string {
  return process.env.APPROVAL_SECRET ?? "dev-only-secret-change-me";
}

class SqliteStore implements Store {
  async saveAnalysis(input: SaveAnalysisInput): Promise<Analysis> {
    const analysis: Analysis = {
      id: randomUUID(),
      repo: input.repo,
      sourceKind: input.sourceKind,
      diff: input.diff,
      riskScore: input.riskScore,
      grade: input.grade,
      filesChanged: input.filesChanged,
      insertions: input.insertions,
      deletions: input.deletions,
      createdAt: new Date().toISOString(),
    };
    const db = getDb();
    db.exec("BEGIN");
    try {
      db.prepare(
        `INSERT INTO analyses (id, repo, source_kind, diff, risk_score, grade, files_changed, insertions, deletions, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        analysis.id,
        analysis.repo,
        analysis.sourceKind,
        analysis.diff,
        analysis.riskScore,
        analysis.grade,
        analysis.filesChanged,
        analysis.insertions,
        analysis.deletions,
        analysis.createdAt,
      );
      const insertFinding = db.prepare(
        `INSERT INTO findings (id, analysis_id, severity, category, title, detail, file_path)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );
      for (const f of input.findings) {
        insertFinding.run(randomUUID(), analysis.id, f.severity, f.category, f.title, f.detail, f.filePath ?? null);
      }
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    return analysis;
  }

  async listAnalyses(limit = 25): Promise<Analysis[]> {
    const rows = getDb()
      .prepare(`SELECT * FROM analyses ORDER BY created_at DESC LIMIT ?`)
      .all(limit) as Record<string, unknown>[];
    return rows.map(fromRow);
  }

  async getAnalysisDetail(id: string): Promise<AnalysisDetail | null> {
    const db = getDb();
    const row = db.prepare(`SELECT * FROM analyses WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    const analysis = fromRow(row);
    const findings = (
      db.prepare(`SELECT * FROM findings WHERE analysis_id = ?`).all(id) as Record<string, unknown>[]
    ).map((r): StoredFinding => ({
      id: String(r.id),
      analysisId: String(r.analysis_id),
      severity: String(r.severity) as Finding["severity"],
      category: String(r.category),
      title: String(r.title),
      detail: String(r.detail),
      filePath: r.file_path ? String(r.file_path) : undefined,
    }));
    const approvals = (
      db.prepare(`SELECT * FROM approvals WHERE analysis_id = ? ORDER BY signed_at ASC, rowid ASC`).all(id) as Record<
        string,
        unknown
      >[]
    ).map((r): Approval => ({
      id: String(r.id),
      analysisId: String(r.analysis_id),
      signer: String(r.signer),
      signedAt: String(r.signed_at),
      prevSig: String(r.prev_sig),
      sig: String(r.sig),
    }));
    const chainValid = verifyChain(
      approvals.map((a) => ({ analysisId: a.analysisId, signer: a.signer, signedAt: a.signedAt })),
      approvals.map((a) => a.sig),
      LEDGER_SEED,
      approvalSecret(),
    );
    return { analysis, findings, approvals, chainValid };
  }

  async approve(analysisId: string, signer: string): Promise<Approval> {
    const db = getDb();
    const last = db
      .prepare(`SELECT sig FROM approvals WHERE analysis_id = ? ORDER BY signed_at DESC, rowid DESC LIMIT 1`)
      .get(analysisId) as { sig: string } | undefined;
    const payload: ApprovalPayload = { analysisId, signer, signedAt: new Date().toISOString() };
    const approval: Approval = {
      id: randomUUID(),
      ...payload,
      prevSig: last?.sig ?? LEDGER_SEED,
      sig: signApproval(payload, last?.sig ?? LEDGER_SEED, approvalSecret()),
    };
    db.prepare(
      `INSERT INTO approvals (id, analysis_id, signer, signed_at, prev_sig, sig) VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(approval.id, approval.analysisId, approval.signer, approval.signedAt, approval.prevSig, approval.sig);
    return approval;
  }
}

class SupabaseRestStore implements Store {
  private headers(): Record<string, string> {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  }

  private base(): string {
    return `${process.env.SUPABASE_URL}/rest/v1`;
  }

  async saveAnalysis(input: SaveAnalysisInput): Promise<Analysis> {
    const analysis: Analysis = {
      id: randomUUID(),
      repo: input.repo,
      sourceKind: input.sourceKind,
      diff: input.diff,
      riskScore: input.riskScore,
      grade: input.grade,
      filesChanged: input.filesChanged,
      insertions: input.insertions,
      deletions: input.deletions,
      createdAt: new Date().toISOString(),
    };
    const res = await fetch(`${this.base()}/analyses`, {
      method: "POST",
      headers: { ...this.headers(), Prefer: "return=representation" },
      body: JSON.stringify([toRow(analysis)]),
    });
    if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`);
    if (input.findings.length > 0) {
      const fres = await fetch(`${this.base()}/findings`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(
          input.findings.map((f) => ({
            id: randomUUID(),
            analysis_id: analysis.id,
            severity: f.severity,
            category: f.category,
            title: f.title,
            detail: f.detail,
            file_path: f.filePath ?? null,
          })),
        ),
      });
      if (!fres.ok) throw new Error(`Supabase findings insert failed: ${fres.status}`);
    }
    return analysis;
  }

  async listAnalyses(limit = 25): Promise<Analysis[]> {
    const res = await fetch(`${this.base()}/analyses?select=*&order=created_at.desc&limit=${limit}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`Supabase query failed: ${res.status}`);
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows.map(fromRow);
  }

  async getAnalysisDetail(id: string): Promise<AnalysisDetail | null> {
    const [aRes, fRes, apRes] = await Promise.all([
      fetch(`${this.base()}/analyses?id=eq.${id}&select=*`, { headers: this.headers() }),
      fetch(`${this.base()}/findings?analysis_id=eq.${id}&select=*`, { headers: this.headers() }),
      fetch(`${this.base()}/approvals?analysis_id=eq.${id}&select=*&order=signed_at.asc`, { headers: this.headers() }),
    ]);
    if (!aRes.ok) throw new Error(`Supabase query failed: ${aRes.status}`);
    const rows = (await aRes.json()) as Record<string, unknown>[];
    if (rows.length === 0) return null;
    const findings = fRes.ok
      ? ((await fRes.json()) as Record<string, unknown>[]).map((r): StoredFinding => ({
          id: String(r.id),
          analysisId: String(r.analysis_id),
          severity: String(r.severity) as Finding["severity"],
          category: String(r.category),
          title: String(r.title),
          detail: String(r.detail),
          filePath: r.file_path ? String(r.file_path) : undefined,
        }))
      : [];
    const approvals = apRes.ok
      ? ((await apRes.json()) as Record<string, unknown>[]).map((r): Approval => ({
          id: String(r.id),
          analysisId: String(r.analysis_id),
          signer: String(r.signer),
          signedAt: String(r.signed_at),
          prevSig: String(r.prev_sig),
          sig: String(r.sig),
        }))
      : [];
    const chainValid = verifyChain(
      approvals.map((a) => ({ analysisId: a.analysisId, signer: a.signer, signedAt: a.signedAt })),
      approvals.map((a) => a.sig),
      LEDGER_SEED,
      approvalSecret(),
    );
    return { analysis: fromRow(rows[0]), findings, approvals, chainValid };
  }

  async approve(analysisId: string, signer: string): Promise<Approval> {
    const res = await fetch(`${this.base()}/approvals?analysis_id=eq.${analysisId}&select=*&order=signed_at.desc&limit=1`, {
      headers: this.headers(),
    });
    const rows = res.ok ? ((await res.json()) as Record<string, unknown>[]) : [];
    const prevSig = rows.length > 0 ? String(rows[0].sig) : LEDGER_SEED;
    const payload: ApprovalPayload = { analysisId, signer, signedAt: new Date().toISOString() };
    const approval: Approval = {
      id: randomUUID(),
      ...payload,
      prevSig,
      sig: signApproval(payload, prevSig, approvalSecret()),
    };
    const insert = await fetch(`${this.base()}/approvals`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify([toApprovalRow(approval)]),
    });
    if (!insert.ok) throw new Error(`Supabase approval insert failed: ${insert.status}`);
    return approval;
  }
}

function toRow(a: Analysis): Record<string, unknown> {
  return {
    id: a.id,
    repo: a.repo,
    source_kind: a.sourceKind,
    diff: a.diff,
    risk_score: a.riskScore,
    grade: a.grade,
    files_changed: a.filesChanged,
    insertions: a.insertions,
    deletions: a.deletions,
    created_at: a.createdAt,
  };
}

function toApprovalRow(a: Approval): Record<string, unknown> {
  return {
    id: a.id,
    analysis_id: a.analysisId,
    signer: a.signer,
    signed_at: a.signedAt,
    prev_sig: a.prevSig,
    sig: a.sig,
  };
}

function fromRow(r: Record<string, unknown>): Analysis {
  return {
    id: String(r.id),
    repo: String(r.repo),
    sourceKind: String(r.source_kind),
    diff: String(r.diff),
    riskScore: Number(r.risk_score),
    grade: String(r.grade),
    filesChanged: Number(r.files_changed),
    insertions: Number(r.insertions),
    deletions: Number(r.deletions),
    createdAt: String(r.created_at),
  };
}

let sqlite: SqliteStore | null = null;
let supabase: SupabaseRestStore | null = null;

export type StoreKind = "sqlite" | "supabase";

export interface StoreEnv {
  [key: string]: string | undefined;
  DATABASE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
}

// Supabase (production) wins when configured; local SQLite is the dev default.
export function selectStoreKind(env: StoreEnv): StoreKind {
  if (env.SUPABASE_URL && (env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_ANON_KEY)) return "supabase";
  const url = env.DATABASE_URL ?? "file:./data/groundtruth.db";
  if (url.startsWith("file:")) return "sqlite";
  throw new Error(
    "No database configured. Set DATABASE_URL=file:./data/groundtruth.db (dev) or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (prod).",
  );
}

export function getStore(): Store {
  return selectStoreKind(process.env) === "supabase"
    ? (supabase ??= new SupabaseRestStore())
    : (sqlite ??= new SqliteStore());
}
