// zabibu canary — CLI entry.
// A Zabibu Technika product · built by Tehillah Kachila.
import { parseArgs } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { render } from "ink";
import React from "react";
import { analyzeContent, DEMO_DIFF } from "@zabibu/engine";
import { collectDiff, inGitRepo, signer } from "./lib/git.ts";
import { readLedger } from "./lib/ledger-file.ts";
import { ReviewApp, type ReviewState } from "./ui/ReviewApp.tsx";
import { githubReport, jsonReport, textReport } from "./ui/text.ts";
import { hookCommand } from "./commands/hook.ts";

const HELP = `
  [ zabibu canary ] — local code review for AI-made changes
  a Zabibu Technika product · built by Tehillah Kachila

  usage:
    zabibu review              review staged changes (or the working tree)
      --staged                review only staged changes
      --working               review only the working tree
      --range <a>..<b>        review an explicit git range (used by the git hook)
      --watch, -w             re-review automatically as files change
      --format <fmt>          text (default) | json | github
    zabibu demo               run the bundled example review
    zabibu hook install       install the pre-push gate in this repo
    zabibu hook remove        remove the gate
    zabibu --version

  exit codes: 0 = clean or approved · 1 = critical findings without a signed approval
`;

function diffHash(diff: string): string {
  return createHash("sha256").update(diff).digest("hex").slice(0, 16);
}

function hasCritical(findings: { severity: string }[]): boolean {
  return findings.some((f) => f.severity === "critical");
}

async function runReview(opts: {
  staged?: boolean;
  working?: boolean;
  range?: string;
  watch?: boolean;
  format: string;
}): Promise<void> {
  if (!inGitRepo()) {
    console.error("zabibu canary: not inside a git repository.");
    process.exitCode = 1;
    return;
  }

  let diff: string;
  try {
    diff = collectDiff({ staged: opts.staged, working: opts.working, range: opts.range });
  } catch (err) {
    console.error(`zabibu canary: could not read the git diff (${err instanceof Error ? err.message : err}).`);
    process.exitCode = 1;
    return;
  }

  if (diff.trim().length === 0) {
    console.log("zabibu canary: nothing to review — stage or make some changes first.");
    return;
  }

  const result = analyzeContent(diff);
  const analysisId = diffHash(diff);
  const label = opts.range ? `range ${opts.range}` : opts.working ? "working tree" : "staged changes";
  let reviewState: ReviewState | undefined;

  if (opts.format === "json") {
    console.log(jsonReport(result));
  } else if (opts.format === "github") {
    console.log(githubReport(result));
  } else if (!process.stdout.isTTY || opts.watch) {
    console.log(textReport(result, `reviewing: ${label}`));
  } else {
    reviewState = { approved: readLedger().some((r) => r.analysisId === analysisId) };
    const app = render(
      React.createElement(ReviewApp, {
        analysisId,
        result,
        signer: signer(),
        watch: Boolean(opts.watch),
        state: reviewState,
      }),
    );
    await app.waitUntilExit();
  }

  if (!reviewState?.approved && hasCritical(result.findings) && process.env.CANARY_ACK !== "1") {
    process.exitCode = 1;
  }
}

let state: ReviewState | undefined;

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    options: {
      staged: { type: "boolean" },
      working: { type: "boolean" },
      range: { type: "string" },
      watch: { type: "boolean", short: "w" },
      format: { type: "string", short: "f", default: "text" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }
  if (values.version) {
    console.log("0.1.0");
    return;
  }

  const command = positionals[0] ?? "review";

  if (command === "demo") {
    const result = analyzeContent(DEMO_DIFF);
    const analysisId = diffHash(DEMO_DIFF);
    if (values.format === "json") console.log(jsonReport(result));
    else if (values.format === "github") console.log(githubReport(result));
    else if (!process.stdout.isTTY) console.log(textReport(result, "demo: a realistic change from an AI coding session"));
    else {
      const reviewState: ReviewState = { approved: readLedger().some((r) => r.analysisId === analysisId) };
      state = reviewState;
      const app = render(
        React.createElement(ReviewApp, {
          analysisId,
          result,
          signer: signer(),
          watch: false,
          state: reviewState,
        }),
      );
      await app.waitUntilExit();
    }
    if (hasCritical(result.findings) && !state?.approved && process.env.CANARY_ACK !== "1") process.exitCode = 1;
    return;
  }

  if (command === "hook") {
    const action = positionals[1] === "remove" ? "remove" : "install";
    hookCommand(action);
    return;
  }

  if (command === "review") {
    await runReview({
      staged: values.staged,
      working: values.working,
      range: values.range,
      watch: values.watch,
      format: values.format ?? "text",
    });
    return;
  }

  console.error(`zabibu canary: unknown command "${command}".\n`);
  console.log(HELP);
  process.exitCode = 1;
}

await main();
