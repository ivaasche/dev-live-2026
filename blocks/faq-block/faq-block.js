/**
 * faq-block — "frequently asked questions" list of native <details> rows with a plus/minus
 * toggle (source div.faq-block.faq-block--default; main.css faq-block rules).
 *
 * Authoring rows (classified by content, defensive):
 *   - a row holding only a heading, before the first question — the block title
 *   - one row per question: the question heading (first cell or leading heading) and the
 *     answer (paragraphs/lists — same cell or second cell)
 *
 * @variants block class: first-open (the first question open at rest, as the source)
 * Decode tier: reconstructive (repeat group) — canon skeleton container > title + list >
 *   item > details > summary (icons + question) + description; authored nodes MOVED in.
 */

const SPRITE = () => `${window.hlx?.codeBasePath || ''}/icons/sprite.svg`;

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

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function icon(name, className) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', className);
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${SPRITE()}#icon-${name}`);
  svg.append(use);
  return svg;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .faq-block-container')) return; // EW9 re-entrant

  const container = el('section', 'faq-block-container');
  container.setAttribute('aria-labelledby', 'faq');
  const list = el('ul', 'faq-block-list');
  let title = null;
  [...block.children].forEach((row) => {
    const nodes = [...row.children].flatMap((cell) => cellNodes(cell));
    const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
    if (!heading) return;
    const rest = nodes.filter((n) => n !== heading);
    if (!rest.length && !list.children.length && !title) {
      title = heading;
      title.classList.add('faq-block-title');
      return;
    }
    const li = el('li', 'faq-block-list-item');
    const details = el('details', 'faq-block-list-item-dropdown');
    const summary = el('summary', 'faq-block-list-item-toggle');
    const icons = el('div', 'faq-block-list-item-icon-container');
    icons.append(
      icon('plus-thin', 'faq-block-list-item-icon-plus'),
      icon('minus-thin', 'faq-block-list-item-icon-minus'),
    );
    heading.classList.add('faq-block-list-item-title');
    summary.append(icons, heading);
    const description = el('div', 'faq-block-list-item-description text-content');
    description.append(...rest);
    details.append(summary, description);
    if (!list.children.length && block.classList.contains('first-open')) details.open = true;
    li.append(details);
    list.append(li);
  });

  block.classList.add('faq-block-default');
  if (title) container.append(title);
  container.append(list);
  block.replaceChildren(container);
}
