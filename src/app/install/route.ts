// Served at /install — the curl installer.
// Tries the published npm package first, and falls back to a source install
// from the GitHub repo if the registry is unreachable.

const SCRIPT = `#!/bin/sh
# ─────────────────────────────────────────────────────────────
#  zabibu canary — installer
#  a Zabibu Technika product · built by Tehillah Kachila
# ─────────────────────────────────────────────────────────────
set -e

echo ""
echo "  [ zabibu canary ] installer"
echo "  local-first code review for AI-made changes"
echo ""

command -v node >/dev/null 2>&1 || { echo "  x node.js is required (https://nodejs.org)"; exit 1; }
echo "  ok node $(node --version)"

if npm install -g zabibucanary@latest >/dev/null 2>&1; then
  echo "  ok installed via npm"
else
  echo "  .. npm install failed — installing from source"
  command -v git >/dev/null 2>&1 || { echo "  x git is required for the source install"; exit 1; }
  tmp=$(mktemp -d)
  git clone --depth 1 https://github.com/Zabibu-Technika/zabibu-canary.git "$tmp/zabibu-canary" >/dev/null 2>&1
  (cd "$tmp/zabibu-canary" && npm install --no-audit --no-fund >/dev/null 2>&1 && npm link -w cli >/dev/null 2>&1)
  echo "  ok installed from source (repo kept at $tmp/zabibu-canary — keep that folder)"
fi

echo ""
echo "  ────────────────────────────────────────────"
echo "  try it:    zabibucanary demo"
echo "  gate it:   zabibucanary hook install   (inside any git repo)"
echo "  ────────────────────────────────────────────"
echo ""
`;

export async function GET() {
  return new Response(SCRIPT, {
    headers: {
      "Content-Type": "text/x-shellscript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
