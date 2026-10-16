import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES } from "@/lib/routes";
import { SITE, absolute } from "@/lib/site";

// Generated from the one route table, so the sitemap cannot miss a page that
// exists or advertise one that does not.
//
// lastModified is SITE.contentUpdated — a hand-bumped date, not `new Date()`.
// A lastmod that changes on every request is noise engines learn to ignore.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SITE.contentUpdated);
  return PUBLIC_ROUTES.map((route) => ({
    url: absolute(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
