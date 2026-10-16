import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeContent, analyzeDiff, analyzeText, gradeFor, looksLikeDiff, parseDiff, redactSecrets, REDACTED } from "./analyze.ts";

test("redacts a matched credential but keeps the key name", () => {
  const out = redactSecrets('STRIPE_SECRET_KEY = "sk_live_51H8xQ2eZvKYlo2C9mBn7PqR"');
  assert.ok(!out.includes("sk_live_51H8xQ2eZvKYlo2C9mBn7PqR"));
  assert.ok(out.includes("STRIPE_SECRET_KEY"));
  assert.ok(out.includes(REDACTED));
});

test("redacts unquoted assignments, bare tokens and private-key blocks", () => {
  assert.equal(redactSecrets("API_KEY=abcdefghijklmnopqrstuvwxyz"), `API_KEY=${REDACTED}`);
  assert.equal(redactSecrets("token: ghp_abcdefghijklmnopqrstuvwxyz"), `token: ${REDACTED}`);
  assert.equal(redactSecrets("AKIAIOSFODNN7EXAMPLE"), REDACTED);
  assert.equal(redactSecrets("-----BEGIN RSA PRIVATE KEY-----"), REDACTED);
});

test("redacts every occurrence, not just the first", () => {
  const out = redactSecrets('a_secret = "1111111111"\nb_secret = "2222222222"');
  assert.ok(!out.includes("1111111111"));
  assert.ok(!out.includes("2222222222"));
});

test("leaves ordinary lines alone, and never adds or removes a line", () => {
  const plain = 'NODE_ENV = "production"\nconst port = 3000';
  assert.equal(redactSecrets(plain), plain);
  // Line structure has to survive: the stored diff must still line up with the
  // findings that reference it.
  assert.equal(redactSecrets('x_secret = "aaaaaaaaaaaa"\nplain').split("\n").length, 2);
});

test("redaction is idempotent", () => {
  const once = redactSecrets(riskyDiff);
  assert.equal(redactSecrets(once), once);
});

test("a redacted diff no longer trips the secret detector — so the analysis must run on the original", () => {
  const redacted = redactSecrets(riskyDiff);
  assert.ok(!redacted.includes("sk_live_51H8xQ2eZvKYlo2C9mBn7PqR"));
  // The route therefore analyses `content` and stores `redactSecrets(content)`.
  // If it analysed the redacted copy, the secret finding would silently vanish.
  assert.ok(analyzeContent(riskyDiff).findings.some((f) => f.category === "secrets"));
  assert.ok(!analyzeContent(redacted).findings.some((f) => f.title.includes("hardcoded secret")));
});

const riskyDiff = `diff --git a/.env b/.env
new file mode 100644
--- /dev/null
+++ b/.env
@@ -0,0 +1,2 @@
+STRIPE_SECRET_KEY = "sk_live_51H8xQ2eZvKYlo2C9mBn7PqR"
+NODE_ENV = "production"

diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 111..222 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -1,2 +1,3 @@
 model User {
+  tenantId String
 }
`;

const packageDiff = `diff --git a/package.json b/package.json
index 111..222 100644
--- a/package.json
+++ b/package.json
@@ -1,3 +1,4 @@
 {
+  "lodash": "^4.17.21",
 }
`;

const cleanDiff = `diff --git a/src/lib/__tests__/engine.test.ts b/src/lib/__tests__/engine.test.ts
index 111..222 100644
--- a/src/lib/__tests__/engine.test.ts
+++ b/src/lib/__tests__/engine.test.ts
@@ -1,2 +1,3 @@
 import { test } from "node:test";
+// added a comment
 test("works", () => {});
`;

test("parses per-file stats from a diff", () => {
  const files = parseDiff(riskyDiff);
  assert.equal(files.length, 2);
  assert.equal(files[0].path, ".env");
  assert.equal(files[0].isNew, true);
  assert.equal(files[0].insertions, 2);
  assert.equal(files[1].insertions, 1);
});

test("flags hardcoded secrets in .env as critical", () => {
  const { findings } = analyzeDiff(riskyDiff);
  const secret = findings.filter((f) => f.category === "secrets");
  assert.ok(secret.length >= 2);
  assert.ok(secret.every((f) => f.severity === "critical"));
  assert.ok(secret.some((f) => f.filePath === ".env"));
});

test("flags schema changes as high severity", () => {
  const { findings } = analyzeDiff(riskyDiff);
  const schema = findings.find((f) => f.category === "schema");
  assert.ok(schema);
  assert.equal(schema.severity, "high");
});

test("flags unpinned dependency versions", () => {
  const { findings } = analyzeDiff(packageDiff);
  const unpinned = findings.find((f) => f.title === "Unpinned dependency version");
  assert.ok(unpinned);
  assert.equal(unpinned.severity, "medium");
});

test("test-only diff scores lowest", () => {
  const result = analyzeDiff(cleanDiff);
  assert.equal(result.filesChanged, 1);
  assert.equal(result.riskScore, 0);
  assert.equal(result.grade, "A");
  assert.ok(result.findings.every((f) => f.severity === "info"));
});

test("score clamps to 100 and caps grade at E for kitchen-sink diffs", () => {
  const many = Array.from({ length: 10 }, () => riskyDiff).join("\n");
  const result = analyzeDiff(many);
  assert.equal(result.riskScore, 100);
  assert.equal(result.grade, "E");
});

test("grade bands are ordered", () => {
  assert.equal(gradeFor(0), "A");
  assert.equal(gradeFor(20), "B");
  assert.equal(gradeFor(35), "C");
  assert.equal(gradeFor(60), "D");
  assert.equal(gradeFor(85), "E");
});

test("tells diffs apart from plain pasted text", () => {
  assert.ok(looksLikeDiff("diff --git a/x b/x\nindex 111..222\n"));
  assert.ok(looksLikeDiff("some intro\n@@ -1,2 +1,2 @@\n"));
  assert.ok(!looksLikeDiff("const apiKey = 'sk-abcdefghijklmnopqrst1234';"));
  assert.ok(!looksLikeDiff("Here is the login page my AI wrote:"));
});

test("text mode flags a pasted secret as critical", () => {
  const { findings } = analyzeText("here is my config:\napi_key = sk-abcdefghijklmnopqrst1234\n");
  const secret = findings.find((f) => f.category === "secrets");
  assert.ok(secret);
  assert.equal(secret.severity, "critical");
});

test("text mode flags eval and string-concatenated SQL", () => {
  const evalResult = analyzeText("const result = eval(userInput);");
  assert.ok(evalResult.findings.some((f) => f.category === "dangerous-code"));
  const sqlResult = analyzeText('db.query("SELECT * FROM users WHERE id = " + id);');
  assert.ok(sqlResult.findings.some((f) => f.category === "injection"));
});

test("text mode gives harmless text a clean bill", () => {
  const result = analyzeText("function add(a, b) {\n  return a + b;\n}\n// adds two numbers");
  assert.equal(result.riskScore, 0);
  assert.equal(result.grade, "A");
  assert.equal(result.findings.length, 0);
});

test("analyzeContent routes each input to the right analyzer", () => {
  const diffResult = analyzeContent(
    'diff --git a/.env b/.env\nnew file mode 100644\n--- /dev/null\n+++ b/.env\n@@ -0,0 +1 @@\n+API_KEY = "sk-abcdefghijklmnopqrstuvwx"\n',
  );
  assert.ok(diffResult.findings.some((f) => f.category === "secrets"));
  assert.ok(diffResult.filesChanged > 0);

  const textResult = analyzeContent("api_key = sk-abcdefghijklmnopqrstuvwx\n");
  assert.ok(textResult.findings.some((f) => f.category === "secrets"));
  assert.equal(textResult.filesChanged, 0);
});
