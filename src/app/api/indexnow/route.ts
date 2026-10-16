import { NextRequest, NextResponse } from "next/server";
import { indexNowPayload, submitToIndexNow } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

// GET is a dry run: it returns exactly what would be submitted and touches
// nothing. Safe to hit from anywhere, and it is how you check the key and URL
// wiring before pinging a third party.
export function GET() {
  return NextResponse.json({ dryRun: true, payload: indexNowPayload() });
}

// POST actually submits. If INDEXNOW_SECRET is set, the caller must send it in
// x-indexnow-secret — otherwise anyone could make us ping on demand. With the
// secret unset it still works, but it will not stay that way in production.
export async function POST(req: NextRequest) {
  const secret = process.env.INDEXNOW_SECRET;
  if (secret && req.headers.get("x-indexnow-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await submitToIndexNow();
  return NextResponse.json({ configured: Boolean(secret), ...result }, { status: result.ok ? 200 : 502 });
}
