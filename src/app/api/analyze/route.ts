import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeContent, DEMO_DIFF } from "zabibucanary-engine";
import { getStore } from "@/lib/server/store";
import { seal } from "@/lib/server/token";
import { revalidatePath } from "next/cache";

const MAX_TOKEN = 6000;

const schema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("demo") }),
  z.object({
    mode: z.literal("check"),
    content: z.string().min(1).max(200_000),
    source: z.string().min(1).max(500).optional(),
  }),
]);

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.flatten() }, { status: 400 });
  }

  // The demo renders statelessly at /analysis/demo — no database involved.
  if (parsed.data.mode === "demo") {
    return NextResponse.json({ redirect: "/analysis/demo" });
  }

  const content = parsed.data.content;
  const repo = parsed.data.source?.trim() || "Pasted from your AI";
  const result = analyzeContent(content);

  let redirect = "";
  try {
    const analysis = await getStore().saveAnalysis({ repo, sourceKind: parsed.data.mode, diff: content, ...result });
    const token = seal({
      id: analysis.id,
      repo: analysis.repo,
      sourceKind: analysis.sourceKind,
      diff: analysis.diff,
      riskScore: analysis.riskScore,
      grade: analysis.grade,
      filesChanged: analysis.filesChanged,
      insertions: analysis.insertions,
      deletions: analysis.deletions,
      createdAt: analysis.createdAt,
      findings: result.findings,
    });
    redirect =
      token.length <= MAX_TOKEN ? `/analysis/${analysis.id}?t=${token}` : `/analysis/${analysis.id}`;
    revalidatePath("/");
  } catch {
    // No shared storage on this instance — fall back to the token-only URL.
    const token = seal({
      id: crypto.randomUUID(),
      repo,
      sourceKind: parsed.data.mode,
      diff: content,
      riskScore: result.riskScore,
      grade: result.grade,
      filesChanged: result.filesChanged,
      insertions: result.insertions,
      deletions: result.deletions,
      createdAt: new Date().toISOString(),
      findings: result.findings,
    });
    redirect = token.length <= MAX_TOKEN ? `/analysis/demo?t=${token}` : "/";
    if (redirect === "/") {
      return NextResponse.json({
        error: "This check is too large for the public demo. Run the CLI for anything this size.",
      }, { status: 413 });
    }
  }

  return NextResponse.json({
    redirect,
    riskScore: result.riskScore,
    grade: result.grade,
    findings: result.findings.length,
  });
}
