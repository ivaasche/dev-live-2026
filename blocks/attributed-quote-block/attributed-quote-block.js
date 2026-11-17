/**
 * attributed-quote-block — a pull quote with a quote-mark icon and its attribution (source
 * section.attributed-quote-block.section > .attributed-quote-block__container > __icon svg +
 * blockquote.attributed-quote-block__content + cite.attributed-quote-block__author).
 *
 * Authoring rows (classified by content, defensive):
 *   - the first row             -> the quote (paragraphs MOVED into the blockquote)
 *   - a following row           -> the attribution (cite)
 * The quote mark is decoration (source aria-hidden svg) → /icons/attributed-quote.svg.
 * Variants (block class): dark | blue — the source section theme; none = white (white-theme).
 *
 * Decode tier: template-slotted — canon skeleton icon + blockquote + cite; authored nodes MOVED
 *   in (EW1).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .section-container')) return; // EW9
  const rows = [...block.querySelectorAll(':scope > div')];
  const container = el('div', 'section-container centralized attributed-quote-block-container');
  const icon = el('div', 'attributed-quote-block-icon');
  icon.setAttribute('aria-hidden', 'true');
  const img = el('img');
  img.src = `${window.hlx?.codeBasePath || ''}/icons/attributed-quote.svg`;
  img.alt = '';
  img.width = 32;
  img.height = 32;
  icon.append(img);
  const quote = el('blockquote', 'attributed-quote-block-content');
  const cite = el('cite', 'attributed-quote-block-author');
  rows.forEach((row, i) => {
    const cell = row.querySelector(':scope > div') || row;
    if (i === 0) {
      const kids = [...cell.children];
      if (kids.length) quote.append(...kids);
      else if (cell.textContent.trim()) {
        const p = el('p');
        p.append(...cell.childNodes);
        quote.append(p);
      }
    } else {
      const p = cell.querySelector('p');
      cite.append(...(p ? p.childNodes : cell.childNodes));
    }
  });
  container.append(icon, quote);
  if (cite.textContent.trim()) container.append(cite);
  block.replaceChildren(container);
  if (block.classList.contains('dark')) block.classList.add('dark-theme');
  else if (block.classList.contains('blue')) block.classList.add('blue-theme');
  else block.classList.add('white-theme');
}
