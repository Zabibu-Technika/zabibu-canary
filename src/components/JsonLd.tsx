import { jsonLdString } from "@/lib/jsonld";

/**
 * Renders a JSON-LD block. Google parses structured data wherever it appears in
 * the document, so this is valid from the body — no head gymnastics needed.
 *
 * `<` is escaped by jsonLdString so a stray `</script>` inside content can never
 * break out of the tag.
 */
export function JsonLd({ data, id }: { data: unknown; id?: string }) {
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
