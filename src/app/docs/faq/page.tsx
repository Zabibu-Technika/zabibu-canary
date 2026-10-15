import { FaqList } from "@/components/Faq";

export default function DocsFaq() {
  return (
    <>
      <p className="docs-eyebrow">man zabibucanary faq</p>
      <h1>FAQ</h1>
      <p className="docs-lede">
        The questions people actually ask before they trust a tool with their code.
      </p>

      <FaqList />

      <h2>Still stuck?</h2>
      <p>
        Open an issue on GitHub, or start with the <a href="/docs">overview</a> and the{" "}
        <a href="/docs/commands">command reference</a>.
      </p>
    </>
  );
}
