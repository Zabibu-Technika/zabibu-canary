// Non-interactive report formats: colored text for terminals, GitHub Actions
// annotations for CI, and JSON for tooling.
import { sectorImpacts, verdictFor, type AnalysisResult } from "zabibucanary-engine";

const C = {
  reset: "\u001b[0m",
  gray: "\u001b[90m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  red: "\u001b[31m",
  bold: "\u001b[1m",
  // Canary amber — the brand accent (truecolor; degrades gracefully).
  amber: "\u001b[38;2;245;183;63m",
};

function sevColor(severity: string): string {
  return severity === "critical" ? C.red : severity === "high" ? C.yellow : C.gray;
}

export function textReport(result: AnalysisResult, label: string): string {
  const verdict = verdictFor(result.findings);
  const lines: string[] = [];
  lines.push(`${C.bold}${C.amber}[ zabibu canary ]${C.reset} a Zabibu Technika product · built by Tehillah Kachila`);
  lines.push(`${C.gray}${label}${C.reset}`);
  lines.push(
    `risk ${result.riskScore}/100 · grade ${result.grade} · ${verdict.label} ` +
      `(${result.filesChanged} file change(s), +${result.insertions} / −${result.deletions})`,
  );
  lines.push("");
  const impacts = sectorImpacts(result.findings);
  for (const [sector, { level, count }] of Object.entries(impacts)) {
    const filled = "█".repeat(level * 4) + "░".repeat(12 - level * 4);
    const color = level >= 3 ? C.red : level >= 2 ? C.yellow : level >= 1 ? C.green : C.gray;
    lines.push(`${C.gray}${sector.padEnd(16)}${C.reset}${color}${filled}${C.reset}${C.gray} ${level}/3 (${count})${C.reset}`);
  }
  lines.push("");
  if (result.findings.length === 0) {
    lines.push(`${C.green}nothing to worry about — this change looks safe.${C.reset}`);
  } else {
    for (const f of result.findings) {
      lines.push(`${sevColor(f.severity)}${C.bold}[${f.severity}] ${f.title}${C.reset}`);
      if (f.filePath) lines.push(`${C.amber}  file: ${f.filePath}${C.reset}`);
      lines.push(`${C.gray}  ${f.detail}${C.reset}`);
    }
  }
  return lines.join("\n");
}

export function githubReport(result: AnalysisResult): string {
  const lines: string[] = [];
  for (const f of result.findings) {
    if (f.severity === "info" || f.severity === "low") continue;
    const level = f.severity === "critical" ? "error" : "warning";
    lines.push(`::${level} title=zabibu canary [${f.severity}] ${f.title}::${f.detail.replace(/\n/g, " ")}`);
  }
  if (result.findings.some((f) => f.severity === "critical")) {
    lines.push(`::error title=zabibu canary::risk score ${result.riskScore}/100 — critical findings present`);
  }
  return lines.join("\n");
}

export function jsonReport(result: AnalysisResult): string {
  return JSON.stringify(
    {
      tool: "zabibucanary",
      vendor: "Zabibu Technika",
      author: "Tehillah Kachila",
      riskScore: result.riskScore,
      grade: result.grade,
      filesChanged: result.filesChanged,
      insertions: result.insertions,
      deletions: result.deletions,
      sectors: sectorImpacts(result.findings),
      findings: result.findings,
    },
    null,
    2,
  );
}
