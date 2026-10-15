import React, { useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import fs from "node:fs";
import { analyzeContent, sectorImpacts, verdictFor, type AnalysisResult } from "@zabibu/engine";
import { appendApproval, readLedger } from "../lib/ledger-file.ts";
import { collectDiff } from "../lib/git.ts";
import { FindingRow, Header, SectorBars } from "./parts.tsx";

export interface ReviewState {
  approved: boolean;
}

interface Props {
  analysisId: string;
  result: AnalysisResult;
  signer: string;
  watch: boolean;
  state: ReviewState;
}

export function ReviewApp({ analysisId, result, signer, watch, state }: Props) {
  const { exit } = useApp();
  const [current, setCurrent] = useState(result);
  const [alreadyApproved, setAlreadyApproved] = useState(() =>
    readLedger().some((r) => r.analysisId === analysisId),
  );
  const [justSigned, setJustSigned] = useState(false);
  const verdict = verdictFor(current.findings);
  const verdictColor = verdict.tone === "stop" ? "red" : verdict.tone === "care" ? "yellow" : "green";

  useInput((input, key) => {
    if (input === "a" && !alreadyApproved && !justSigned) {
      appendApproval(analysisId, signer);
      state.approved = true;
      setJustSigned(true);
    }
    if (input === "q" || key.escape || (key.ctrl && input === "c")) exit();
  });

  useEffect(() => {
    if (!watch) return;
    let timer: NodeJS.Timeout | undefined;
    const watcher = fs.watch(process.cwd(), { recursive: false }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const diff = collectDiff({});
          if (diff.trim().length > 0) setCurrent(analyzeContent(diff));
        } catch {
          /* repo may be mid-operation; keep the last result */
        }
      }, 600);
    });
    return () => {
      clearTimeout(timer);
      watcher.close();
    };
  }, [watch]);

  return (
    <Box flexDirection="column">
      <Header subtitle={`reviewing ${current.filesChanged} file change(s) · +${current.insertions} / −${current.deletions}`} />
      <Text>
        risk <Text bold>{current.riskScore}</Text>
        <Text color="gray">/100</Text> · grade <Text bold>{current.grade}</Text> ·{" "}
        <Text color={verdictColor} bold>
          {verdict.label}
        </Text>
      </Text>
      <SectorBars impacts={sectorImpacts(current.findings)} />
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>findings ({current.findings.length})</Text>
        {current.findings.length === 0 ? (
          <Text color="green">nothing to worry about — this change looks safe.</Text>
        ) : (
          current.findings.map((f, i) => <FindingRow key={`${f.title}-${f.filePath ?? i}`} finding={f} />)
        )}
      </Box>
      {justSigned && <Text color="green">✓ approval receipt signed and recorded in {readLedgerPath()}</Text>}
      {alreadyApproved && <Text color="green">✓ this exact change already has a signed receipt — pushes will pass.</Text>}
      <Text color="gray">[a] approve &amp; sign receipt   [q] quit</Text>
    </Box>
  );
}

function readLedgerPath(): string {
  return `${process.env.USERPROFILE ?? process.env.HOME}/.zabibu-canary/ledger.jsonl`;
}
