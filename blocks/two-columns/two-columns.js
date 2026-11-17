/**
 * two-columns — an image beside a text column (title, rich text, optional CTA), or a text
 * column alone (source div.two-columns.light-theme, main.css @412356–415486, prototypes
 * css/offering.css).
 *
 * Authoring rows — one row per item (the source renders one item per block):
 *   - a cell holding only a picture — the image column
 *   - the text cell: the leading heading = the item title; a paragraph holding only a
 *     formatted link (**_link_** = tertiary pill) = the CTA under the text; every other
 *     node = the item text (paragraphs, lists)
 *
 * @variants block class: reverse (image right >= 58.75rem — source .two-columns--reverse);
 *   dark (source .two-columns.dark-theme — black band, white text)
 * Decode tier: template-slotted per item — canon container > item > image column + text
 *   column (title + text + CTA); authored nodes MOVED into their slots (EW1).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|PICTURE|DIV|BLOCKQUOTE|TABLE|PRE|HR)$/;

// a cell's authored nodes: a bare-inline cell is MOVED into a <p> (keeps its paragraph role)
function cellNodes(cell) {
  if ([...cell.children].some((n) => BLOCK_TAGS.test(n.tagName))) return [...cell.children];
  if (!cell.textContent.trim() && !cell.children.length) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  cell.append(p);
  return [p];
}

function isCta(node) {
  const a = node.querySelector('a.button');
  return node.tagName === 'P' && a && node.textContent.trim() === a.textContent.trim();
}

function item(row) {
  const nodes = [...row.children].flatMap(cellNodes);
  const pictures = [];
  const textNodes = [];
  nodes.forEach((node) => {
    const pic = node.matches('picture') ? node : node.querySelector('picture');
    if (pic && !node.textContent.trim()) pictures.push(pic);
    else textNodes.push(node);
  });

  const el = div('two-columns-item');
  pictures.forEach((pic) => {
    pic.querySelector('img')?.classList.add('two-columns-item-image');
    el.append(div('two-columns-item-column two-columns-item-column-image', pic));
  });

  const column = div('two-columns-item-column');
  const heading = textNodes.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) {
    heading.classList.add('two-columns-item-title');
    column.append(heading);
  }
  const ctas = textNodes.filter((n) => n !== heading && isCta(n));
  const body = textNodes.filter((n) => n !== heading && !ctas.includes(n));
  if (body.length) column.append(div('two-columns-item-text', ...body));
  ctas.forEach((p) => {
    p.classList.add('two-columns-item-cta');
    p.querySelector('a.button').classList.add('two-columns-item-btn-link');
    column.append(p);
  });
  el.append(column);
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .two-columns-container')) return; // EW9 re-entrant
  block.classList.add(block.classList.contains('dark') ? 'dark-theme' : 'light-theme');
  const items = [...block.children].map(item);
  block.replaceChildren(div('two-columns-container', ...items));
}
