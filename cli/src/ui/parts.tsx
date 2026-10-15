import React from "react";
import { Box, Text } from "ink";
import { SECTORS, SECTOR_INFO, plainify, type SectorImpact } from "zabibucanary-engine";
import type { Finding } from "zabibucanary-engine";

export function Header({ subtitle }: { subtitle?: string }) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="#f5b73f">
        [ zabibu canary ]
      </Text>
      <Text color="gray">a Zabibu Technika product · built by Tehillah Kachila</Text>
      {subtitle && <Text color="gray">{subtitle}</Text>}
    </Box>
  );
}

export function SectorBars({ impacts }: { impacts: Record<string, SectorImpact> }) {
  return (
    <Box flexDirection="column" marginY={1}>
      {SECTORS.map((s) => {
        const { level, count } = impacts[s];
        const filled = level * 4;
        const bar = "█".repeat(filled) + "░".repeat(12 - filled);
        const color = level >= 3 ? "red" : level >= 2 ? "yellow" : level >= 1 ? "green" : "gray";
        return (
          <Text key={s}>
            <Text color="gray">{`${SECTOR_INFO[s].label} `.padEnd(16)}</Text>
            <Text color={color}>{bar}</Text>
            <Text color="gray">{` ${level}/3 (${count})`}</Text>
          </Text>
        );
      })}
    </Box>
  );
}

export function FindingRow({ finding }: { finding: Finding }) {
  const plain = plainify(finding);
  const color = finding.severity === "critical" ? "red" : finding.severity === "high" ? "yellow" : "gray";
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={color}>
        {`[${plain.cta}] ${plain.headline}`}
      </Text>
      <Text color="gray">{`  why: ${plain.why}`}</Text>
      <Text color="gray">{`  fix: ${plain.fix}`}</Text>
      {finding.filePath && <Text color="#f5b73f">{`  file: ${finding.filePath}`}</Text>}
    </Box>
  );
}
