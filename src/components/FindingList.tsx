import { AlertOctagon, AlertTriangle, Info, ShieldCheck } from "lucide-react";
import type { StoredFinding } from "@/lib/server/store";
import { plainify } from "@zabibu/engine";

const ICONS = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: AlertTriangle,
  low: Info,
  info: ShieldCheck,
} as const;

const TONE: Record<string, string> = {
  critical: "danger",
  high: "warn",
  medium: "warn",
  low: "info",
  info: "info",
};

export function FindingList({ findings }: { findings: StoredFinding[] }) {
  if (findings.length === 0) {
    return <p className="empty">Nothing to worry about — this change looks safe.</p>;
  }
  return (
    <div>
      {findings.map((f) => {
        const Icon = ICONS[f.severity] ?? Info;
        const plain = plainify(f);
        return (
          <article key={f.id} className={`finding finding-${f.severity}`}>
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            <div>
              <h3>
                {plain.headline}
                <span className={`badge badge-${TONE[f.severity] ?? "info"}`}>{plain.cta}</span>
              </h3>
              <p>
                <strong>Why it matters:</strong> {plain.why}
              </p>
              <p>
                <strong>What to do:</strong> {plain.fix}
              </p>
              {f.filePath && (
                <p>
                  <code className="file-path">{f.filePath}</code>
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
