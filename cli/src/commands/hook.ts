// `zabibucanary hook install|remove` — installs a pre-push gate that runs the same
// engine the TUI uses, so risky changes never leave the machine unsigned.
import { existsSync, rmSync, writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";
import { gitDir } from "../lib/git.ts";

const HOOK = `#!/bin/sh
# zabibu canary — pre-push gate (installed by: zabibucanary hook install)
# Blocks pushes whose changes carry critical findings and have no signed approval.
if ! command -v zabibucanary >/dev/null 2>&1; then
  echo "zabibu canary: CLI not found — skipping (npm i -g zabibucanary)"
  exit 0
fi
remote_ref=$(git rev-parse --abbrev-ref --symbolic-full-name @{push} 2>/dev/null || git rev-parse HEAD~1)
zabibucanary review --range "\${remote_ref}..HEAD" --format text
status=$?
if [ $status -ne 0 ]; then
  echo ""
  echo "zabibu canary: push blocked. Run 'zabibucanary review' and approve, or set CANARY_ACK=1 to override."
  exit 1
fi
exit 0
`;

export function hookCommand(action: "install" | "remove", cwd = process.cwd()): void {
  const dir = gitDir(cwd);
  const hookPath = join(dir, "hooks", "pre-push");

  if (action === "remove") {
    if (existsSync(hookPath)) {
      rmSync(hookPath);
      console.log("zabibu canary: pre-push hook removed.");
    } else {
      console.log("zabibu canary: no pre-push hook installed.");
    }
    return;
  }

  writeFileSync(hookPath, HOOK, "utf8");
  try {
    chmodSync(hookPath, 0o755);
  } catch {
    /* Windows: git-bash honors the shebang; mode is best-effort */
  }
  console.log("zabibu canary: pre-push gate installed — risky changes now need a signed approval.");
  console.log(`  hook: ${hookPath}`);
}
