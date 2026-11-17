/**
 * case-rte — a labelled rich-text section: a small uppercase slash label on the left, a
 * title and rich text on the right (source div.section.case-rte > .section__container
 * .case-rte__container.centralized > .case-rte__header + .case-rte__body; main.css case-rte).
 *
 * Authoring rows (classified by content, defensive):
 *   - the first heading (<h2>) -> the label (source h2.case-rte__header__title)
 *   - the next heading (<h3>) -> the body title
 *   - any other element -> the body rich text, in authored order
 *
 * Variants (block class): dark | blue | white — the source section's dark-theme / blue-theme /
 *   white-theme band (the foundation theme classes); none = no band (page background).
 *
 * Decode tier: template-slotted — canon skeleton container > header + body; authored nodes
 *   MOVED in (EW1).
 */

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|PICTURE|DIV|BLOCKQUOTE|TABLE|PRE|HR)$/;

function cellNodes(cell) {
  if ([...cell.children].some((n) => BLOCK_TAGS.test(n.tagName))) return [...cell.children];
  if (!cell.textContent.trim() && !cell.children.length) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  cell.append(p);
  return [p];
}

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .case-rte-container')) return; // EW9
  const nodes = [...block.querySelectorAll(':scope > div > div')].flatMap(cellNodes);
  const container = div('case-rte-container');
  const header = div('case-rte-header');
  const body = div('case-rte-body');
  const text = document.createElement('div');
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName) && !header.children.length) {
      n.classList.add('case-rte-header-title');
      header.append(n);
    } else if (/^H[1-6]$/.test(n.tagName) && !body.querySelector('.case-rte-body-title')) {
      n.classList.add('case-rte-body-title');
      body.append(n);
    } else text.append(n);
  });
  body.append(text);
  container.append(header, body);
  block.replaceChildren(container);
  if (block.classList.contains('dark')) block.classList.add('dark-theme');
  else if (block.classList.contains('blue')) block.classList.add('blue-theme');
  else if (block.classList.contains('white')) block.classList.add('white-theme');
}
