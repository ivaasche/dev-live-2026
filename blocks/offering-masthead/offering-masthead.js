/**
 * offering-masthead — a large page/section title over an offset description column (source
 * div.offering-masthead; main.css offering-masthead rules).
 *
 * Authoring rows (classified by content, defensive — any order, cells may be missing):
 *   - the first heading -> the title (the page <h1>, or an <h2> when the page already has
 *     one — styled the same as the source h1)
 *   - a paragraph that only holds a link -> the button
 *   - any other element (paragraphs, lists, tables) -> the description, in authored order
 *
 * Decode tier: template-slotted — canon skeleton title + content > description; authored
 *   nodes MOVED in (EW1).
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
  if (block.querySelector(':scope > .offering-masthead-title')) return; // EW9
  const nodes = [...block.querySelectorAll(':scope > div > div')].flatMap(cellNodes);
  const title = div('offering-masthead-title');
  const content = div('offering-masthead-content');
  const description = div('offering-masthead-description');
  const button = div('offering-masthead-button');
  nodes.forEach((n) => {
    const link = n.tagName === 'P' ? n.querySelector('a[href]') : null;
    if (/^H[1-6]$/.test(n.tagName) && !title.children.length) title.append(n);
    else if (link && n.textContent.trim() === link.textContent.trim()) button.append(n);
    else description.append(n);
  });
  content.append(description);
  if (button.children.length) content.append(button);
  block.replaceChildren(title, content);
}
