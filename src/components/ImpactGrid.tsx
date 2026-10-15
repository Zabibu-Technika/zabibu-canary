import { SECTORS, SECTOR_INFO, findingSectors, plainify } from "@zabibu/engine";
import type { StoredFinding } from "@/lib/server/store";

const SHORT: Record<string, string> = {
  security: "Sec",
  trust: "Trust",
  usage: "Usage",
  accessibility: "Access",
  dependability: "Depend",
};

export function ImpactGrid({ findings }: { findings: StoredFinding[] }) {
  if (findings.length === 0) return null;
  return (
    <div className="impact-grid-wrap">
      <table className="impact-grid">
        <thead>
          <tr>
            <th>Finding</th>
            {SECTORS.map((s) => (
              <th key={s} title={SECTOR_INFO[s].question}>
                {SHORT[s]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {findings.map((f) => {
            const sectors = findingSectors(f);
            return (
              <tr key={f.id}>
                <td className="impact-grid-finding">{plainify(f).headline}</td>
                {SECTORS.map((s) => (
                  <td key={s}>
                    <span
                      className={`cell lvl-${sectors[s]}`}
                      role="img"
                      aria-label={`${SECTOR_INFO[s].label}: ${sectors[s]} of 3`}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="helper impact-legend">
        Damage potential per sector:
        <span className="cell lvl-1" /> low
        <span className="cell lvl-2" /> medium
        <span className="cell lvl-3" /> high
      </p>
    </div>
  );
}
