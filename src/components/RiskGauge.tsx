import type { Verdict } from "zabibucanary-engine";

export function RiskGauge({
  score,
  grade,
  verdict,
}: {
  score: number;
  grade: string;
  verdict: Verdict;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const tone = score >= 70 ? "danger" : score >= 40 ? "warn" : "ok";

  return (
    <div
      className={`gauge tone-${tone}`}
      role="img"
      aria-label={`Risk score ${score} of 100. Verdict: ${verdict.label}`}
    >
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle className="gauge-track" cx="64" cy="64" r={radius} />
        <circle
          className="gauge-value"
          cx="64"
          cy="64"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-label">
        <strong>{score}</strong>
        <span>/ 100 risk</span>
        <em className={`verdict verdict-${verdict.tone}`}>{verdict.label}</em>
      </div>
    </div>
  );
}
