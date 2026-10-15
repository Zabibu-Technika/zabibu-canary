import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/server/store";
import { revalidatePath } from "next/cache";

const schema = z.object({
  analysisId: z.string().min(1).max(100),
  signer: z.string().min(2).max(120),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { analysisId, signer } = parsed.data;
  const store = getStore();
  const detail = await store.getAnalysisDetail(analysisId);
  if (!detail) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  const approval = await store.approve(analysisId, signer.trim());
  revalidatePath(`/analysis/${analysisId}`);
  return NextResponse.json({
    id: approval.id,
    sigPreview: approval.sig.slice(0, 16),
    signedAt: approval.signedAt,
  });
}
