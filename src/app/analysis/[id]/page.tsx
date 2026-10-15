import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileSearch, Radar, ShieldAlert, ShieldCheck } from "lucide-react";
import { getStore } from "@/lib/server/store";
import { verdictFor } from "@/lib/server/plain";
import { SECTORS, SECTOR_INFO, sectorImpacts } from "@/lib/server/impact";
import { RiskGauge } from "@/components/RiskGauge";
import { FindingList } from "@/components/FindingList";
import { ApprovePanel } from "@/components/ApprovePanel";
import { ImpactRadar } from "@/components/ImpactRadar";
import { ImpactBars } from "@/components/ImpactBars";
import { ImpactGrid } from "@/components/ImpactGrid";

export const dynamic = "force-dynamic";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getStore().getAnalysisDetail(id);
  if (!detail) notFound();

  const { analysis, findings, approvals, chainValid } = detail;
  const verdict = verdictFor(findings);
  const impacts = sectorImpacts(findings);
  const checkedWhat =
    analysis.filesChanged > 0
      ? `We checked ${analysis.filesChanged} file change${analysis.filesChanged === 1 ? "" : "s"} (${analysis.insertions} lines added, ${analysis.deletions} removed)`
      : `We checked the text you pasted (${analysis.insertions} lines)`;

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="backlink">
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          All checks
        </Link>
        <span className="tagline">GroundTruth</span>
      </header>

      <section className="card detail-head">
        <RiskGauge score={analysis.riskScore} grade={analysis.grade} verdict={verdict} />
        <div className="detail-meta">
          <h1>{analysis.repo}</h1>
          <p className="lede">
            {checkedWhat} · {new Date(analysis.createdAt).toLocaleString()}
          </p>
          <p>
            {approvals.length === 0 ? (
              <span className="badge badge-warn">Waiting for approval</span>
            ) : chainValid ? (
              <span className="badge badge-ok">
                <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
                Approval receipt valid
              </span>
            ) : (
              <span className="badge badge-danger">
                <ShieldAlert size={14} strokeWidth={2} aria-hidden="true" />
                Approval receipt has a problem
              </span>
            )}
          </p>
        </div>
      </section>

      <section className="card">
        <h2>
          <FileSearch size={16} strokeWidth={1.75} aria-hidden="true" />
          What we found ({findings.length})
        </h2>
        <FindingList findings={findings} />
      </section>

      <section className="card">
        <h2>
          <Radar size={16} strokeWidth={1.75} aria-hidden="true" />
          The damage map
        </h2>
        <p className="lede">
          Where this change could hurt. Each sector is scored 0–3, from the findings that touch it —
          the further the shape reaches, the wider the possible damage.
        </p>
        <div className="impact-layout">
          <ImpactRadar impacts={impacts} />
          <ImpactBars impacts={impacts} />
        </div>
        <ImpactGrid findings={findings} />
        <ul className="sector-legend">
          {SECTORS.map((s) => (
            <li key={s}>
              <strong>{SECTOR_INFO[s].label}</strong>
              {SECTOR_INFO[s].question}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <ApprovePanel analysisId={analysis.id} approvals={approvals} chainValid={chainValid} />
      </section>

      <details className="card">
        <summary>The exact input we checked</summary>
        <pre>{analysis.diff}</pre>
      </details>
    </main>
  );
}
