"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine, ShieldCheck } from "lucide-react";
import type { Approval } from "@/lib/server/store";

const STORE_KEY = "zabibucanary:receipts";

// In stateless (public demo) renders, the server cannot recall approvals made
// on another instance — so receipts are also kept in this browser.
function readLocal(analysisId: string): Approval[] {
  try {
    const all = JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}") as Record<string, Approval[]>;
    return all[analysisId] ?? [];
  } catch {
    return [];
  }
}

function writeLocal(analysisId: string, record: Approval): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}") as Record<string, Approval[]>;
    all[analysisId] = [...(all[analysisId] ?? []), record];
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch {
    /* storage full or unavailable — receipts still show for this session */
  }
}

export function ApprovePanel({
  analysisId,
  approvals,
  chainValid,
}: {
  analysisId: string;
  approvals: Approval[];
  chainValid: boolean;
}) {
  const router = useRouter();
  const [signer, setSigner] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localReceipts, setLocalReceipts] = useState<Approval[]>([]);

  useEffect(() => {
    setLocalReceipts(readLocal(analysisId));
  }, [analysisId]);

  const shown = approvals.length > 0 ? approvals : localReceipts;
  const fromBrowser = approvals.length === 0 && localReceipts.length > 0;

  async function sign() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, signer }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Something went wrong. Please try again.");
      writeLocal(analysisId, data as unknown as Approval);
      setLocalReceipts(readLocal(analysisId));
      setSigner("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2>Your approval receipt</h2>
      <p className="lede">
        Approving creates a tamper-proof record that a real person reviewed and approved these changes.
        If anyone edits them afterwards, the receipt breaks — so it holds up when someone asks,
        &ldquo;who approved this?&rdquo;
      </p>
      <div className="approve-row">
        <input
          value={signer}
          onChange={(e) => setSigner(e.target.value)}
          placeholder="Your name or email"
          maxLength={120}
          aria-label="Your name or email"
        />
        <button className="btn btn-primary" onClick={sign} disabled={busy || signer.trim().length < 2}>
          <PenLine size={16} strokeWidth={1.75} aria-hidden="true" />
          I approve these changes
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {shown.length > 0 ? (
        <>
          <table className="ledger">
            <thead>
              <tr>
                <th>#</th>
                <th>Signed by</th>
                <th>When</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((a, i) => (
                <tr key={a.id}>
                  <td className="meta">{i + 1}</td>
                  <td>{a.signer}</td>
                  <td className="meta">{new Date(a.signedAt).toLocaleString()}</td>
                  <td>
                    <code className="file-path">{a.sig.slice(0, 16)}…</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 14, marginBottom: 0 }}>
            {fromBrowser ? (
              <span className="badge badge-info">Receipt signed and kept in this browser (public demo)</span>
            ) : chainValid ? (
              <span className="badge badge-ok">
                <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
                Receipt verified
              </span>
            ) : (
              <span className="badge badge-danger">Receipt has a problem</span>
            )}
          </p>
        </>
      ) : (
        <p className="empty">Nobody has approved these changes yet. If they were about to go live, this would be the moment to wait.</p>
      )}
    </div>
  );
}
