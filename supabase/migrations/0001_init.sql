-- GroundTruth — production schema (Supabase / Postgres)
-- Apply with: supabase db push  (or paste into the SQL editor)

create table if not exists analyses (
  id text primary key,
  repo text not null,
  source_kind text not null,
  diff text not null,
  risk_score integer not null,
  grade text not null,
  files_changed integer not null,
  insertions integer not null,
  deletions integer not null,
  created_at timestamptz not null default now()
);

create table if not exists findings (
  id text primary key,
  analysis_id text not null references analyses(id) on delete cascade,
  severity text not null,
  category text not null,
  title text not null,
  detail text not null,
  file_path text
);

create table if not exists approvals (
  id text primary key,
  analysis_id text not null references analyses(id) on delete cascade,
  signer text not null,
  signed_at timestamptz not null default now(),
  prev_sig text not null,
  sig text not null
);

create index if not exists idx_findings_analysis on findings(analysis_id);
create index if not exists idx_approvals_analysis on approvals(analysis_id);

-- Row Level Security: the app uses the service-role key server-side only.
-- Anonymous clients have no access. Elevation-of-privilege defense (STRIDE).
alter table analyses enable row level security;
alter table findings enable row level security;
alter table approvals enable row level security;

create policy "service_role_all" on analyses
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service_role_all" on findings
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service_role_all" on approvals
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
