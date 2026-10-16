import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

// Straightforward allow-list. No user-agent sniffing and no per-crawler rules —
// a bot that is welcome should be welcome under its own name too.
//
// Disallowed, and why:
//   /api/       — JSON endpoints, not content.
//   /analysis/  — one person's review output, behind a signed token. It renders
//                 for them; it is not a page we want in an index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/analysis/"],
      },
    ],
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
