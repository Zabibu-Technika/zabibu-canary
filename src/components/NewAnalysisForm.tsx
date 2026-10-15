"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Sparkles } from "lucide-react";

export function NewAnalysisForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(mode: "demo" | "check") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "demo" ? { mode } : { mode, content }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Something went wrong. Please try again.");
      router.push(`/analysis/${data.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label htmlFor="ai-output" style={{ display: "block", fontWeight: 600, fontSize: 13.5, marginBottom: 8 }}>
        Paste what your AI gave you
      </label>
      <textarea
        id="ai-output"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={"For example, copy the code your AI wrote:\n\nfunction login(user, password) {\n  const query = \"SELECT * FROM users WHERE name = '\" + user + \"'\";\n  return db.query(query);\n}"}
        spellCheck={false}
      />
      <p className="helper" style={{ marginTop: 8 }}>
        Code blocks, git changes, or notes about what changed — anything works.
      </p>
      <div className="chips">
        <span className="chip-label">Works with</span>
        <span className="chip">OpenCode</span>
        <span className="chip">Claude Code</span>
        <span className="chip">Cline</span>
        <span className="chip">Codex</span>
        <span className="chip">Windsurf</span>
        <span className="chip">ChatGPT</span>
        <span className="chip">Claude</span>
        <span className="chip">Copilot</span>
        <span className="chip">Cursor</span>
        <span className="chip">git diffs</span>
      </div>
      <div className="row">
        <button className="btn btn-primary" onClick={() => run("check")} disabled={busy || content.trim().length === 0}>
          <Play size={16} strokeWidth={1.75} aria-hidden="true" />
          Check it now
        </button>
        <button className="btn" onClick={() => run("demo")} disabled={busy}>
          <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />
          Show me an example
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
