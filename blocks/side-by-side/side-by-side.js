/**
 * side-by-side — a square picture panel next to a text panel (source
 * div.section.case-visual-side-by-side, white theme): title (h3) and copy paragraphs.
 *
 * Authoring: one row, two cells — a picture cell and a text cell (heading + paragraphs); the
 * cell order is the panel order (picture first = source panel--first panel--image).
 * Variant classes: none needed for the hub pages; `dark` reserved for the source dark theme.
 *
 * Decode tier: template-slotted (canon container > panel + panel > text-content skeleton;
 * authored picture / heading / paragraphs MOVED in, EW1).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .side-by-side-container')) return; // EW9 re-entrant
  block.classList.add('white-theme');

  const cells = [...block.querySelectorAll(':scope > div > div')];
  const container = div('side-by-side-container');
  let n = 0;
  cells.forEach((cell) => {
    const picture = cell.querySelector('picture');
    const hasText = [...cell.children].some((c) => !c.querySelector('picture')
      && c.tagName !== 'PICTURE' && c.textContent.trim());
    if (!picture && !hasText) return;
    n += 1;
    const order = n === 1 ? 'panel-first' : 'panel-second';
    if (picture && !hasText) {
      picture.classList.add('side-by-side-picture');
      container.append(div(`side-by-side-panel ${order} panel-image panel-square`, picture));
      return;
    }
    const nodes = [...cell.children];
    const heading = nodes.find((c) => /^H[1-6]$/.test(c.tagName));
    const copy = nodes.filter((c) => c !== heading);
    const text = div('side-by-side-text-content');
    if (heading) {
      heading.classList.add('side-by-side-title');
      text.append(heading);
    }
    if (copy.length) text.append(div('side-by-side-copy', ...copy));
    container.append(div(`side-by-side-panel ${order} panel-text`, text));
  });
  block.replaceChildren(container);
}
