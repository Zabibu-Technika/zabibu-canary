import { SECTORS, SECTOR_INFO, type SectorImpact } from "@zabibu/engine";

export function ImpactBars({ impacts }: { impacts: Record<string, SectorImpact> }) {
  return (
    <div className="impact-bars">
      {SECTORS.map((s) => {
        const { level, count } = impacts[s];
        return (
          <div key={s} className={`impact-bar-row lvl-${level}`}>
            <span className="impact-bar-label">{SECTOR_INFO[s].label}</span>
            <span className="impact-bar-track">
              <span className="impact-bar-fill" style={{ width: `${(level / 3) * 100}%` }} />
            </span>
            <span className="impact-bar-dots">
              {[1, 2, 3].map((n) => (
                <span key={n} className={`dot${n <= level ? " on" : ""}`} />
              ))}
              <span className="impact-count meta">{count}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
