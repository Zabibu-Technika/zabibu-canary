#!/usr/bin/env node
// Launcher for the installed CLI: registers the TS loader, then runs the entry.
const { register } = await import("tsx/esm/api");
register();
await import("../src/index.tsx");
