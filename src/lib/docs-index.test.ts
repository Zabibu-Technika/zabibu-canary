import assert from "node:assert/strict";
import test from "node:test";
import { DOC_INDEX, searchDocs } from "./docs-index.ts";

const VALID_HREFS = new Set([
  "/docs",
  "/docs/installation",
  "/docs/commands",
  "/docs/git-hooks",
  "/docs/how-it-works",
  "/docs/sectors",
  "/docs/web",
  "/docs/deployment",
  "/docs/faq",
]);

test("every index entry points at a real docs page", () => {
  for (const entry of DOC_INDEX) {
    assert.ok(VALID_HREFS.has(entry.href), `${entry.id} has invalid href ${entry.href}`);
  }
});

test("entry ids are unique", () => {
  const ids = DOC_INDEX.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("empty or whitespace query returns nothing", () => {
  assert.deepEqual(searchDocs(""), []);
  assert.deepEqual(searchDocs("   "), []);
});

test("an exact page title ranks first", () => {
  const [top] = searchDocs("Installation");
  assert.equal(top.href, "/docs/installation");
});

test("keyword search finds the right page", () => {
  const hrefs = searchDocs("supabase").map((r) => r.href);
  assert.ok(hrefs.includes("/docs/deployment"), "supabase should surface the deployment page");
});

test("multi-word queries require every word", () => {
  const results = searchDocs("exit codes");
  assert.ok(results.length > 0);
  assert.equal(results[0].href, "/docs/commands");
});

test("privacy questions surface the FAQ", () => {
  const hrefs = searchDocs("is my code sent anywhere").map((r) => r.href);
  assert.ok(hrefs.includes("/docs/faq"));
});

test("nonsense queries return no results", () => {
  assert.deepEqual(searchDocs("zzxqwerty"), []);
});

test("respects the result limit", () => {
  assert.ok(searchDocs("the", 3).length <= 3);
});
