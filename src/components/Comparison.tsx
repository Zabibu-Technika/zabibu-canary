// How Canary compares.
//
// Every cell is limited to something we can stand behind: what a vendor's own
// public documentation states, or what is structurally true of the product. That
// means we concede the cells where a competitor is stronger — CodeRabbit's CLI
// reviews local changes before you push, and PR-Agent is genuinely self-hostable —
// because a comparison table that marks a real competitor "no" everywhere is not
// a comparison, it is an advert, and it would be the first thing a sceptical
// reader checks.
//
// Sources: coderabbit.ai/cli and docs.coderabbit.ai/overview/ide-cli-review,
// GitHub Copilot code review docs, github.com/The-PR-Agent/pr-agent (Apache-2.0).
// Checked October 2026. Re-check before editing.
type Tone = "yes" | "partial" | "no";

type Mark = { label: string; tone: Tone };

const YES: Mark = { label: "✓", tone: "yes" };
const PARTIAL: Mark = { label: "~", tone: "partial" };
const NO: Mark = { label: "—", tone: "no" };
const word = (label: string, tone: Tone): Mark => ({ label, tone });

// Columns, in order: CodeRabbit CLI · GitHub Copilot code review · Qodo PR-Agent
const ROWS: { feature: string; canary: Mark; others: Mark[] }[] = [
  {
    feature: "Code never leaves your machine",
    canary: YES,
    others: [NO, NO, PARTIAL],
  },
  {
    feature: "No account, no API key, no network",
    canary: YES,
    others: [NO, NO, PARTIAL],
  },
  {
    feature: "Same diff, same report every time (rules, not an LLM)",
    canary: YES,
    others: [NO, NO, NO],
  },
  {
    feature: "Reviews local changes before you push",
    canary: YES,
    others: [YES, NO, PARTIAL],
  },
  {
    feature: "Five-sector damage map",
    canary: YES,
    others: [NO, NO, NO],
  },
  {
    feature: "Signed approval receipt, verifiable offline",
    canary: YES,
    others: [NO, NO, NO],
  },
  {
    feature: "Licence",
    canary: word("MIT", "yes"),
    others: [word("proprietary", "no"), word("proprietary", "no"), word("Apache-2.0", "partial")],
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
            <th>CodeRabbit CLI</th>
            <th>Copilot Review</th>
            <th>PR-Agent</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.feature}>
              <td>{r.feature}</td>
              <td className="compare-us">
                <span className={`compare-cell ${r.canary.tone}`}>{r.canary.label}</span>
              </td>
              {r.others.map((o, i) => (
                <td key={i}>
                  <span className={`compare-cell ${o.tone}`}>{o.label}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="helper" style={{ marginTop: 10 }}>
        From each vendor&apos;s public documentation, checked October 2026. ✓ yes · ~ partial or
        cloud-dependent · — not offered. <strong>Where they win:</strong> CodeRabbit and Copilot review
        the whole repository with one-click fixes and deep pull-request integration, and CodeRabbit&apos;s
        CLI reviews before you push too; PR-Agent is the only one here you can run entirely on your own
        infrastructure. Canary is the layer underneath — the offline gate with a receipt. Use them
        together.
      </p>
    </div>
  );
}
