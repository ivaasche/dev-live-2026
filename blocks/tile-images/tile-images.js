/**
 * tile-images — a grid of 2–6 image tiles (source div.tile-images.tile-images--<n>;
 * main.css @157053–160686).
 *
 * Authoring rows (defensive): one picture per row (any cell; extra cells/rows without a
 * picture are kept after the grid). The tile count picks the source layout
 * (tile-images-<n> class, n = 2..6).
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton images-content > list > item;
 *   authored pictures MOVED into the items.
 */

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
  if (block.querySelector(':scope > .tile-images-images-content')) return; // EW9 re-entrant

  const content = document.createElement('div');
  content.className = 'tile-images-images-content';
  const list = document.createElement('ul');
  list.className = 'tile-images-images-list';
  const rest = [];
  [...block.querySelectorAll(':scope > div > div')].flatMap((cell) => cellNodes(cell)).forEach((node) => {
    const pic = node.matches('picture') ? node : node.querySelector('picture');
    if (pic && !node.textContent.trim()) {
      const li = document.createElement('li');
      li.className = 'tile-images-images-item';
      pic.querySelector('img')?.classList.add('tile-images-images-item-img');
      li.append(pic);
      list.append(li);
    } else {
      rest.push(node);
    }
  });
  const n = Math.min(Math.max(list.children.length, 2), 6);
  block.classList.add(`tile-images-${n}`);
  content.append(list, ...rest);
  block.replaceChildren(content);
}
