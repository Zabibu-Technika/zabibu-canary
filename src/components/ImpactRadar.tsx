import { SECTORS, SECTOR_INFO, type SectorImpact } from "@zabibu/engine";

const SIZE = 300;
const C = SIZE / 2;
const R = 88;
const LABEL_R = R + 22;

function point(index: number, radius: number) {
  const angle = ((-90 + (index * 360) / SECTORS.length) * Math.PI) / 180;
  return { x: C + Math.cos(angle) * radius, y: C + Math.sin(angle) * radius };
}

function polygon(radius: number) {
  return SECTORS.map((_, i) => {
    const p = point(i, radius);
    return `${p.x},${p.y}`;
  }).join(" ");
}

export function ImpactRadar({ impacts }: { impacts: Record<string, SectorImpact> }) {
  const maxLevel = Math.max(...SECTORS.map((s) => impacts[s].level));
  const tone = maxLevel >= 3 ? "danger" : maxLevel >= 2 ? "warn" : "ok";
  const dataPoints = SECTORS.map((s, i) => {
    const p = point(i, (R * impacts[s].level) / 3);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <figure className="impact-radar">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Damage map across five sectors">
        {[1, 2, 3].map((ring) => (
          <polygon key={ring} className="radar-ring" points={polygon((R * ring) / 3)} />
        ))}
        {SECTORS.map((s, i) => {
          const p = point(i, R);
          return <line key={s} className="radar-spoke" x1={C} y1={C} x2={p.x} y2={p.y} />;
        })}
        {maxLevel > 0 && <polygon className={`radar-area tone-${tone}`} points={dataPoints} />}
        {SECTORS.map((s, i) => {
          const p = point(i, LABEL_R);
          const anchor = Math.abs(p.x - C) < 8 ? "middle" : p.x > C ? "start" : "end";
          return (
            <text key={s} className="radar-label" x={p.x} y={p.y + 4} textAnchor={anchor}>
              {SECTOR_INFO[s].label}
            </text>
          );
        })}
      </svg>
      {maxLevel === 0 && <figcaption>No sector takes damage from this change.</figcaption>}
    </figure>
  );
}
