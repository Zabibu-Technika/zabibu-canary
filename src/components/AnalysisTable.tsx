import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Analysis } from "@/lib/server/store";
import { verdictForGrade } from "zabibucanary-engine";

export function AnalysisTable({ analyses }: { analyses: Analysis[] }) {
  if (analyses.length === 0) {
    return (
      <div className="card empty">
        <ShieldCheck size={28} strokeWidth={1.5} aria-hidden="true" />
        <p>No checks yet. Try the example above — it takes five seconds and shows exactly what you would get.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Risk</th>
            <th>Verdict</th>
            <th>What you checked</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((a) => {
            const verdict = verdictForGrade(a.grade);
            return (
              <tr key={a.id} className="rowlink">
                <td className="meta">
                  <Link href={`/analysis/${a.id}`}>{a.riskScore}/100</Link>
                </td>
                <td>
                  <span className={`badge badge-${verdict.tone === "ok" ? "ok" : verdict.tone === "care" ? "warn" : "danger"}`}>
                    {verdict.label}
                  </span>
                </td>
                <td>
                  <Link href={`/analysis/${a.id}`}>{a.repo}</Link>
                </td>
                <td className="meta">{new Date(a.createdAt).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
