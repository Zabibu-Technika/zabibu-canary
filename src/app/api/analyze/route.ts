import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeContent, DEMO_DIFF } from "zabibucanary-engine";
import { getStore } from "@/lib/server/store";
import { revalidatePath } from "next/cache";

// Two modes only, from the user's point of view:
//   demo   — the built-in example change
//   check  — anything they pasted; the engine decides if it's a diff or free text
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

  let content: string;
  let repo: string;
  if (parsed.data.mode === "demo") {
    content = DEMO_DIFF;
    repo = "Example: a realistic change from an AI coding session";
  } else {
    content = parsed.data.content;
    repo = parsed.data.source?.trim() || "Pasted from your AI";
  }

  const result = analyzeContent(content);
  const analysis = await getStore().saveAnalysis({ repo, sourceKind: parsed.data.mode, diff: content, ...result });

  revalidatePath("/");
  return NextResponse.json({
    id: analysis.id,
    riskScore: analysis.riskScore,
    grade: analysis.grade,
    findings: result.findings.length,
  });
}
