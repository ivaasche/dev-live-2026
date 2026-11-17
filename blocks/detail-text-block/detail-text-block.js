/**
 * detail-text-block — case-study text band: a red rule (>= 58.75rem), a heading group
 * (pretitle shown above the title) and a rich-text column (source section.detail-text-block;
 * main.css detail-text-block rules).
 *
 * Authoring rows (classified by content, defensive — one cell or many):
 *   - the leading headings, in source order: title (<h2>), then pretitle (<h3>), then an
 *     optional subtitle — the pretitle is painted above the title by CSS order, as the source
 *   - a first row holding only headings, followed by other rows: that row is the whole heading
 *     group (headings in later rows stay in the rich text)
 *   - everything after the leading headings — the rich text (paragraphs, lists, quotes,
 *     pictures)
 *
 * Decode tier: template-slotted — canon skeleton container > inner > hgroup + rte;
 *   authored headings and rich-text nodes MOVED into their slots.
 */

const SLOTS = ['title', 'pretitle', 'subtitle'];

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|PICTURE|DIV|BLOCKQUOTE|TABLE|PRE|HR)$/;

// a cell's authored nodes: EDS unwraps a single-paragraph cell into bare inline content —
// that content is MOVED into a <p> so it keeps its paragraph role
function cellNodes(cell) {
  if ([...cell.children].some((n) => BLOCK_TAGS.test(n.tagName))) return [...cell.children];
  if (!cell.textContent.trim() && !cell.children.length) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  cell.append(p);
  return [p];
}

export default function decorate(block) {
  if (block.querySelector(':scope > .detail-text-block-container')) return; // EW9 re-entrant

  // a row holding only headings is the heading group; a later row's headings are rich text
  // (source: an <h5> opening the rte column, not an hgroup subtitle)
  const rows = [...block.children];
  const headRow = rows.length > 1 && [...rows[0].querySelectorAll(':scope > div > *')]
    .every((n) => /^H[1-6]$/.test(n.tagName));
  const nodes = [...block.querySelectorAll(':scope > div > div')].flatMap((cell) => cellNodes(cell));
  const headCount = headRow ? rows[0].querySelectorAll(':scope > div > *').length : Infinity;
  const hgroup = document.createElement('hgroup');
  hgroup.className = 'detail-text-block-hgroup';
  const rte = div('detail-text-block-rte text-content');
  let leading = true;
  nodes.forEach((node) => {
    if (leading && /^H[1-6]$/.test(node.tagName) && hgroup.children.length < SLOTS.length
      && hgroup.children.length < headCount) {
      node.classList.add(`detail-text-block-hgroup-${SLOTS[hgroup.children.length]}`);
      hgroup.append(node);
    } else {
      leading = false;
      rte.append(node);
    }
  });

  const container = div('detail-text-block-container');
  const inner = div('detail-text-block-inner');
  if (hgroup.children.length) inner.append(hgroup);
  if (rte.children.length) inner.append(rte);
  container.append(inner);
  block.replaceChildren(container);
}
