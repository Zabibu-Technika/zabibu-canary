// A static mock of the CLI review, rendered as a real terminal block.
// Shows visitors what the product feels like before they install anything.

export function TerminalDemo() {
  return (
    <div className="term-demo" aria-label="Example terminal output from zabibucanary review">
      <div className="term-line">
        <span className="term-prompt">$</span>zabibucanary review --staged
      </div>
      <div className="term-line term-dim">[ zabibu canary ] a Zabibu Technika product · built by Tehillah Kachila</div>
      <div className="term-line term-dim">reviewing 8 file change(s) · +24 / −2</div>
      <div className="term-line">
        risk <span className="term-red">100/100</span> · grade <span className="term-red">E</span> ·{" "}
        <span className="term-red">Stop — fix these first</span>
      </div>
      <div className="term-line">&nbsp;</div>
      <div className="term-line">
        <span className="term-dim">security&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className="term-red">████████████</span>
        <span className="term-dim"> 3/3 (6)</span>
      </div>
      <div className="term-line">
        <span className="term-dim">trust&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className="term-red">████████████</span>
        <span className="term-dim"> 3/3 (4)</span>
      </div>
      <div className="term-line">
        <span className="term-dim">usage&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className="term-yellow">████████░░░░</span>
        <span className="term-dim"> 2/3 (1)</span>
      </div>
      <div className="term-line">
        <span className="term-dim">accessibility&nbsp;</span>
        <span className="term-red">████████████</span>
        <span className="term-dim"> 3/3 (2)</span>
      </div>
      <div className="term-line">
        <span className="term-dim">dependability</span>
        <span className="term-red">████████████</span>
        <span className="term-dim"> 3/3 (5)</span>
      </div>
      <div className="term-line">&nbsp;</div>
      <div className="term-line">
        <span className="term-red">[critical]</span> A password or secret key is written right in the code
      </div>
      <div className="term-line term-dim">&nbsp;&nbsp;file: .env</div>
      <div className="term-line term-dim">&nbsp;&nbsp;fix: move it to a private settings file, and change it now</div>
      <div className="term-line">&nbsp;</div>
      <div className="term-line term-caret-after">
        <span className="term-dim">[a] approve &amp; sign receipt&nbsp;&nbsp;[q] quit</span>
      </div>
    </div>
  );
}
