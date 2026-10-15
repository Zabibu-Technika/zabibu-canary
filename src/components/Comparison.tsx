// How Canary compares, based on public feature lists (October 2026).
const CELLS = {
  yes: { label: "✓", tone: "yes" },
  partial: { label: "~", tone: "partial" },
  no: { label: "—", tone: "no" },
} as const;

const ROWS: { feature: string; canary: keyof typeof CELLS; others: { name: string; value: keyof typeof CELLS }[] }[] = [
  {
    feature: "Reviews on your machine — code never leaves",
    canary: "yes",
    others: [
      { name: "CodeRabbit", value: "no" },
      { name: "Copilot Review", value: "no" },
      { name: "PR-Agent", value: "partial" },
    ],
  },
  {
    feature: "Pre-push gate before code leaves the repo",
    canary: "yes",
    others: [
      { name: "CodeRabbit", value: "no" },
      { name: "Copilot Review", value: "no" },
      { name: "PR-Agent", value: "partial" },
    ],
  },
  {
    feature: "Plain-English reports non-developers can act on",
    canary: "yes",
    others: [
      { name: "CodeRabbit", value: "no" },
      { name: "Copilot Review", value: "no" },
      { name: "PR-Agent", value: "no" },
    ],
  },
  {
    feature: "Multi-sector damage map (5 sectors)",
    canary: "yes",
    others: [
      { name: "CodeRabbit", value: "no" },
      { name: "Copilot Review", value: "no" },
      { name: "PR-Agent", value: "no" },
    ],
  },
  {
    feature: "Signed, tamper-evident approval receipts",
    canary: "yes",
    others: [
      { name: "CodeRabbit", value: "no" },
      { name: "Copilot Review", value: "no" },
      { name: "PR-Agent", value: "no" },
    ],
  },
  {
    feature: "Free & open source (MIT)",
    canary: "yes",
    others: [
      { name: "CodeRabbit", value: "partial" },
      { name: "Copilot Review", value: "partial" },
      { name: "PR-Agent", value: "yes" },
    ],
  },
];

export function Comparison() {
  return (
    <div className="compare-wrap">
      <table className="compare">
        <thead>
          <tr>
            <th>Capability</th>
            <th className="compare-us">zabibu canary</th>
            <th>CodeRabbit</th>
            <th>Copilot Review</th>
            <th>PR-Agent</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.feature}>
              <td>{r.feature}</td>
              <td className="compare-us">
                <span className={`compare-cell ${CELLS[r.canary].tone}`}>{CELLS[r.canary].label}</span>
              </td>
              {r.others.map((o) => (
                <td key={o.name}>
                  <span className={`compare-cell ${CELLS[o.value].tone}`}>{CELLS[o.value].label}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="helper" style={{ marginTop: 10 }}>
        Based on public feature lists, October 2026. ✓ full support · ~ partial or cloud-dependent · — not offered.
      </p>
    </div>
  );
}
