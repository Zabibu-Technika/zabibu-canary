// Git helpers — plain child_process, zero dependencies (Ponytail Rung 3).
import { execFileSync } from "node:child_process";

export interface DiffOptions {
  staged?: boolean;
  working?: boolean;
  range?: string;
}

export function inGitRepo(cwd = process.cwd()): boolean {
  try {
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function collectDiff(opts: DiffOptions, cwd = process.cwd()): string {
  if (opts.range) {
    return execFileSync("git", ["diff", opts.range], { cwd, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  }
  if (opts.working) {
    return execFileSync("git", ["diff"], { cwd, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  }
  // Default: staged changes; fall back to the working tree when nothing is staged.
  const staged = execFileSync("git", ["diff", "--staged"], { cwd, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (staged.trim().length > 0) return staged;
  return execFileSync("git", ["diff"], { cwd, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

export function signer(cwd = process.cwd()): string {
  try {
    return execFileSync("git", ["config", "user.email"], { cwd, encoding: "utf8" }).trim() || "unknown-signer";
  } catch {
    return "unknown-signer";
  }
}

export function gitDir(cwd = process.cwd()): string {
  return execFileSync("git", ["rev-parse", "--git-dir"], { cwd, encoding: "utf8" }).trim();
}
