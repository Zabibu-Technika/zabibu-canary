"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine, ShieldCheck } from "lucide-react";
import type { Approval } from "@/lib/server/store";

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

      {approvals.length > 0 ? (
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
              {approvals.map((a, i) => (
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
            {chainValid ? (
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
