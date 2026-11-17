/**
 * columns-rte — a heading over two rich-text columns (side by side >= 58.75rem, stacked
 * below) (source div.columns-rte > .columns-rte__container.text-content > h2 +
 * .columns-rte__content-row > _left-column + _right-column; main.css @columns-rte rules).
 *
 * Authoring rows (classified by shape, defensive):
 *   - a one-cell row holding only headings -> heading(s) above the columns
 *   - a two-cell row -> one content row: left column | right column (rich text)
 *   - any other one-cell row -> a content row with a left column only
 *
 * @variants right-wide | left-wide — the source row modifiers columns-rte-3-4--right-column /
 *   --left-column (one third | two thirds, or the reverse, >= 58.75rem). A blockquote in a
 *   column is the source quote block (big blue open-quote, first paragraph = the quote text).
 *
 * Decode tier: template-slotted — canon container > (heading | content-row > left + right);
 *   authored nodes MOVED into their slots.
 */

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|PICTURE|DIV|BLOCKQUOTE|TABLE|PRE|HR)$/;

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function cellNodes(cell) {
  if ([...cell.children].some((n) => BLOCK_TAGS.test(n.tagName))) return [...cell.children];
  if (!cell.textContent.trim() && !cell.children.length) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  cell.append(p);
  return [p];
}

export default function decorate(block) {
  if (block.querySelector(':scope > .columns-rte-container')) return; // EW9 re-entrant

  const container = div('columns-rte-container text-content');
  [...block.children].forEach((r) => {
    const cells = [...r.children];
    const nodes = cells.map((c) => cellNodes(c));
    if (cells.length === 1 && nodes[0].length && nodes[0].every((n) => /^H[1-6]$/.test(n.tagName))) {
      container.append(...nodes[0]);
      return;
    }
    if (!nodes.flat().length) return;
    const row = div('columns-rte-content-row');
    if (block.classList.contains('right-wide')) row.classList.add('columns-rte-3-4-right-column');
    if (block.classList.contains('left-wide')) row.classList.add('columns-rte-3-4-left-column');
    const left = div('columns-rte-content-left-column');
    left.append(...nodes[0]);
    row.append(left);
    if (cells.length > 1) {
      const right = div('columns-rte-content-right-column');
      right.append(...nodes.slice(1).flat());
      row.append(right);
    }
    row.querySelectorAll('blockquote').forEach((bq) => {
      bq.classList.add('columns-rte-content-quote-block');
      bq.querySelector('p')?.classList.add('columns-rte-content-quote-text');
    });
    container.append(row);
  });
  block.replaceChildren(container);
}
