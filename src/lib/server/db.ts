// Local SQLite database using the built-in node:sqlite module (zero dependencies).
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let db: DatabaseSync | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  repo TEXT NOT NULL,
  source_kind TEXT NOT NULL,
  diff TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  files_changed INTEGER NOT NULL,
  insertions INTEGER NOT NULL,
  deletions INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS findings (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  file_path TEXT
);
CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  signer TEXT NOT NULL,
  signed_at TEXT NOT NULL,
  prev_sig TEXT NOT NULL,
  sig TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_findings_analysis ON findings(analysis_id);
CREATE INDEX IF NOT EXISTS idx_approvals_analysis ON approvals(analysis_id);
`;

function resolvePath(): string {
  const url = process.env.DATABASE_URL ?? "file:./data/groundtruth.db";
  if (!url.startsWith("file:")) {
    throw new Error(`DATABASE_URL "${url}" is not a file: URL — the SQLite driver requires one.`);
  }
  const p = url.slice("file:".length);
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
}

export function getDb(): DatabaseSync {
  if (db) return db;
  const file = resolvePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  db = new DatabaseSync(file);
  db.exec(SCHEMA);
  return db;
}
