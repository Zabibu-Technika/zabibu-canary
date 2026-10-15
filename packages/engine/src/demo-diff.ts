// A realistic "risky diff" used by the demo analysis button — exercises every detector.
export const DEMO_DIFF = `diff --git a/.env b/.env
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/.env
@@ -0,0 +1,3 @@
+STRIPE_SECRET_KEY = "sk_live_51H8xQ2eZvKYlo2C9mBn7PqR4tUvWx"
+SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service-role"
+NEXT_PUBLIC_APP_URL = "http://localhost:3000"

diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 2222222..3333333 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -1,7 +1,10 @@
 model User {
   id        String   @id @default(uuid())
   email     String   @unique
+  role      String   @default("user")
+  tenantId  String
+  createdAt DateTime @default(now())
 }

diff --git a/src/middleware.ts b/src/middleware.ts
index 4444444..5555555 100644
--- a/src/middleware.ts
+++ b/src/middleware.ts
@@ -2,6 +2,9 @@ import { NextResponse } from "next/server";
 export function middleware(req: NextRequest) {
   const token = req.cookies.get("session")?.value;
+  if (!token) return NextResponse.redirect(new URL("/login", req.url));
+  const res = NextResponse.next();
+  res.cookies.set("__edge", "1");
   return res;
 }

diff --git a/package.json b/package.json
index 6666666..7777777 100644
--- a/package.json
+++ b/package.json
@@ -8,6 +8,8 @@
   "dependencies": {
     "next": "15.1.6",
+    "lodash": "^4.17.21",
+    "dayjs": "^1.11.10"
   }

diff --git a/package-lock.json b/package-lock.json
index 8888888..9999999 100644
--- a/package-lock.json
+++ b/package-lock.json
@@ -1,4 +1,4 @@
 {
-  "name": "acme-checkout",
+  "name": "acme-checkout-v2",

diff --git a/.github/workflows/deploy.yml b/.github/workflows/deploy.yml
new file mode 100644
index 0000000..bbbbbbb
--- /dev/null
+++ b/.github/workflows/deploy.yml
@@ -0,0 +1,7 @@
+name: Deploy
+on:
+  push:
+    branches: [main]
+jobs:
+  deploy:
+    runs-on: ubuntu-latest

diff --git a/src/features/billing/InvoiceTable.tsx b/src/features/billing/InvoiceTable.tsx
index aaaaaaa..bbbbbbb 100644
--- a/src/features/billing/InvoiceTable.tsx
+++ b/src/features/billing/InvoiceTable.tsx
@@ -1,5 +1,7 @@
 export function InvoiceTable({ invoices }) {
   return (
-    <table><tbody>{invoices.map(inv => <tr key={inv.id} />)}</tbody></table>
+    <table className="tabular-nums">
+      <tbody>{invoices.map((inv) => <div onClick={() => setOpen(inv.id)} className="row" />)}</tbody>
+    </table>
   );
 }

diff --git a/src/lib/__tests__/ledger.test.ts b/src/lib/__tests__/ledger.test.ts
index ccccccc..ddddddd 100644
--- a/src/lib/__tests__/ledger.test.ts
+++ b/src/lib/__tests__/ledger.test.ts
@@ -1,4 +1,6 @@
 import { test } from "node:test";
+import assert from "node:assert/strict";
 
+test("rejects tampered approvals", () => {});
 test("chains signatures", () => {});
`;
