import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/jsonld";
import type { Metadata } from "next";
import { routeMetadata } from "@/lib/routes";

export const metadata: Metadata = routeMetadata("/docs/faq");

export default function DocsFaq() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary faq</p>
      <h1>FAQ</h1>
      <p className="docs-lede">
        The questions people actually ask before they trust a tool with their code.
      </p>

      <JsonLd id="faq" data={faqPageSchema()} />
      <FaqList />

      <h2>Still stuck?</h2>
      <p>
        Open an issue on GitHub, or start with the <a href="/docs">overview</a> and the{" "}
        <a href="/docs/commands">command reference</a>.
      </p>
    </>
  );
}
