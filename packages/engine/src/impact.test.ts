import { test } from "node:test";
import assert from "node:assert/strict";
import { SECTORS, findingSectors, sectorImpacts } from "./impact.ts";
import type { Finding } from "./analyze.ts";

const f = (category: string): Finding => ({
  severity: "critical",
  category,
  title: "t",
  detail: "d",
});

test("maps secrets and schema findings to their sectors", () => {
  const secrets = findingSectors(f("secrets"));
  assert.equal(secrets.security, 3);
  assert.equal(secrets.trust, 2);
  assert.equal(secrets.usage, 0);

  const schema = findingSectors(f("schema"));
  assert.equal(schema.trust, 3);
  assert.equal(schema.dependability, 2);
});

test("authorization touches security, trust, and accessibility", () => {
  const s = findingSectors(f("authorization"));
  assert.equal(s.security, 3);
  assert.equal(s.trust, 1);
  assert.equal(s.accessibility, 1);
});

test("unknown categories map to zero everywhere", () => {
  const s = findingSectors(f("mystery-category"));
  for (const sector of SECTORS) assert.equal(s[sector], 0);
});

test("sectorImpacts aggregates max level and count", () => {
  const impacts = sectorImpacts([f("secrets"), f("secrets"), f("injection")]);
  assert.deepEqual(impacts.security, { level: 3, count: 3 });
  assert.deepEqual(impacts.trust, { level: 2, count: 2 });
  assert.deepEqual(impacts.usage, { level: 0, count: 0 });
});

test("empty input yields zeroed sectors", () => {
  const impacts = sectorImpacts([]);
  for (const sector of SECTORS) assert.deepEqual(impacts[sector], { level: 0, count: 0 });
});
