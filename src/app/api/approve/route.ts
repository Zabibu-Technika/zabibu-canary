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

  // The record is self-contained (HMAC over analysisId + signer + time, chained
  // to the previous signature), so signing works even when the analysis itself
  // lives in another server instance — the demo's stateless mode.
  const approval = await getStore().approve(analysisId, signer.trim());

  revalidatePath(`/analysis/${analysisId}`);
  return NextResponse.json({
    id: approval.id,
    analysisId: approval.analysisId,
    signer: approval.signer,
    signedAt: approval.signedAt,
    prevSig: approval.prevSig,
    sig: approval.sig,
  });
}
