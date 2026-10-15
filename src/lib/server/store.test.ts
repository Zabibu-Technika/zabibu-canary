import { test } from "node:test";
import assert from "node:assert/strict";
import { selectStoreKind } from "./store.ts";

test("local SQLite is the dev default", () => {
  assert.equal(selectStoreKind({}), "sqlite");
  assert.equal(selectStoreKind({ DATABASE_URL: "file:./data/groundtruth.db" }), "sqlite");
});

test("Supabase wins when configured, even alongside a file: URL", () => {
  assert.equal(
    selectStoreKind({
      DATABASE_URL: "file:/tmp/groundtruth.db",
      SUPABASE_URL: "https://demo.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "key",
    }),
    "supabase",
  );
  assert.equal(
    selectStoreKind({
      SUPABASE_URL: "https://demo.supabase.co",
      SUPABASE_ANON_KEY: "key",
    }),
    "supabase",
  );
});

test("throws when nothing is configured", () => {
  assert.throws(() => selectStoreKind({ DATABASE_URL: "postgres://localhost/db" }));
});
