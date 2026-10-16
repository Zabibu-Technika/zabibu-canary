// /badge.svg — a shields-style badge anyone can drop in a README.
//
// A plain SVG route on purpose: no tracking pixel, no redirect, no query string,
// nothing recorded about who requested it. It is a picture.
export const dynamic = "force-static";

const LABEL = "reviewed with";
const VALUE = "zabibu canary";

// Verdana 11px advance width is close enough to this for a badge, and it keeps
// the file free of a font-metrics dependency.
const CHAR = 6.6;
const PAD = 12;
const H = 20;

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function GET(): Response {
  const label = escapeXml(LABEL);
  const value = escapeXml(VALUE);
  const lw = Math.round(LABEL.length * CHAR + PAD);
  const vw = Math.round(VALUE.length * CHAR + PAD);
  const w = lw + vw;

  // AMOLED black + canary amber, same palette as the site.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${H}" role="img" aria-label="${label}: ${value}">
<title>${label}: ${value}</title>
<linearGradient id="g" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-opacity=".12"/></linearGradient>
<clipPath id="c"><rect width="${w}" height="${H}" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#c)">
<rect width="${lw}" height="${H}" fill="#0a0a0a"/>
<rect x="${lw}" width="${vw}" height="${H}" fill="#f5b73f"/>
<rect width="${w}" height="${H}" fill="url(#g)"/>
</g>
<g font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11" text-anchor="middle">
<text x="${lw / 2}" y="14" fill="#c8c8c8">${label}</text>
<text x="${lw + vw / 2}" y="14" fill="#0a0a0a" font-weight="700">${value}</text>
</g>
</svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400, immutable",
    },
  });
}
