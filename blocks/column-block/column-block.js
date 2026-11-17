/**
 * column-block — two text columns side by side (>= 58.75rem), stacked below: each a large
 * title, an italic subtitle and rich text (source div.column-block-wrapper > __container >
 * div.column-block ×2; main.css @column-block rules).
 *
 * Authoring rows (one row per column, classified by content, defensive):
 *   - the leading headings: the first is the title (source hgroup__title), the next the
 *     subtitle (source hgroup__subtitle)
 *   - everything after them -> the column's rich text (paragraphs, links, pictures)
 *   - a picture before the headings -> the column image, above the hgroup (source column image)
 * Variant `cta-center`: CTA paragraphs centred (source <p style="text-align: center">).
 * The source always renders columns in pairs (an empty second column when only one is
 * filled): an odd authored count gets one empty column to keep the pair spacing.
 *
 * Decode tier: template-slotted — canon row > item > container > inner > hgroup + text;
 *   authored headings and rich-text nodes MOVED into their slots.
 */

const SLOTS = ['title', 'subtitle'];
const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|PICTURE|DIV|BLOCKQUOTE|TABLE|PRE|HR)$/;

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

// a cell's authored nodes: a bare-inline cell is MOVED into a <p> (keeps its paragraph role)
function cellNodes(cell) {
  if ([...cell.children].some((n) => BLOCK_TAGS.test(n.tagName))) return [...cell.children];
  if (!cell.textContent.trim() && !cell.children.length) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  cell.append(p);
  return [p];
}

function item(nodes) {
  const col = div('column-block-item');
  const container = div('column-block-container');
  const inner = div('column-block-inner');
  const hgroup = document.createElement('hgroup');
  hgroup.className = 'column-block-hgroup';
  const text = div('column-block-text');
  let leading = true;
  const media = [];
  nodes.forEach((n) => {
    // a leading picture (source: the column image above __inner) keeps the headings leading
    const isMedia = n.matches('picture') || (n.tagName === 'P' && n.querySelector('picture')
      && !n.textContent.trim());
    if (leading && isMedia && !hgroup.children.length) {
      media.push(n);
    } else if (leading && /^H[1-6]$/.test(n.tagName) && hgroup.children.length < SLOTS.length) {
      n.classList.add(`column-block-hgroup-${SLOTS[hgroup.children.length]}`);
      hgroup.append(n);
    } else {
      leading = false;
      text.append(n);
    }
  });
  inner.append(hgroup);
  if (text.children.length) inner.append(text);
  container.append(...media, inner);
  col.append(container);
  return col;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .column-block-row')) return; // EW9 re-entrant

  const row = div('column-block-row');
  [...block.children].forEach((r) => {
    const nodes = [...r.children].flatMap((c) => cellNodes(c));
    if (nodes.length) row.append(item(nodes));
  });
  if (row.children.length % 2) row.append(item([]));
  block.replaceChildren(row);
}
