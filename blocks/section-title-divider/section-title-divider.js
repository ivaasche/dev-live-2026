/**
 * section-title-divider — a themed band with a section title and a short intro text, placed
 * between page sections (source div.section-title-divider-block.light-theme | .dark-theme;
 * main.css section-title-divider-block rules).
 *
 * Authoring rows (classified by content, defensive — any order, cells may be missing):
 *   - a heading (<h2>) -> the title
 *   - any other element (paragraphs, lists) -> the text, in authored order
 *
 * @variants block class: light (source light-theme, default) | dark (source dark-theme)
 * Decode tier: template-slotted — canon skeleton container > title + text; authored nodes
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
  if (block.querySelector(':scope > .section-title-divider-container')) return; // EW9
  block.classList.add(block.classList.contains('dark') ? 'dark-theme' : 'light-theme');
  const nodes = [...block.querySelectorAll(':scope > div > div')].flatMap(cellNodes);
  const container = div('section-title-divider-container');
  const text = div('section-title-divider-text');
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName) && !container.querySelector('.section-title-divider-title')) {
      n.classList.add('section-title-divider-title');
      container.append(n);
    } else text.append(n);
  });
  if (text.children.length) container.append(text);
  block.replaceChildren(container);
}
