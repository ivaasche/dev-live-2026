/**
 * offering-showcase — a title block over a grid of service items, each an icon, a title and
 * an arrowed link (source section.offering-showcase; main.css offering-showcase rules).
 *
 * Authoring rows: the first row = the title block (heading + optional intro paragraph);
 *   then one row per item: icon cell (`:offering-…:` icon) | text cell (h3 + a paragraph
 *   holding the link). One-cell item rows (no icon) are accepted.
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton container > title-block +
 *   content > item > icon + text-column (title + link > text + arrow); authored nodes MOVED.
 * @ew-exempt the link arrow (source sprite #icon-arrow-right) carries no authored text.
 */

const SPRITE = () => `${window.hlx?.codeBasePath || ''}/icons/sprite.svg`;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function arrow() {
  const box = el('div', 'offering-showcase-content-item-link-arrow');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${SPRITE()}#icon-arrow-right`);
  svg.append(use);
  box.append(svg);
  return box;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .offering-showcase-container')) return; // EW9
  const rows = [...block.children];
  const container = el('div', 'offering-showcase-container');
  const titleBlock = el('div', 'offering-showcase-title-block');
  const content = el('div', 'offering-showcase-content');
  rows.forEach((row) => {
    const cells = [...row.children];
    const isItem = row.querySelector('h3') || (cells.length > 1 && row.querySelector('.icon'));
    if (!isItem) {
      cells.forEach((c) => titleBlock.append(...c.childNodes));
      return;
    }
    const item = el('div', 'offering-showcase-content-item');
    const iconBox = el('div', 'offering-showcase-content-item-icon');
    const textCol = el('div', 'offering-showcase-content-item-text-column');
    const icon = row.querySelector('.icon');
    if (icon) iconBox.append(icon);
    cells.forEach((c) => {
      [...c.children].forEach((n) => {
        // the icon's own paragraph — the icon was moved to the icon box above, so it is left
        // empty (was appended as an empty <p> with its 1.5rem margin: +24 px per item)
        if (!n.textContent.trim() && !n.querySelector('img, picture, a, svg')) return;
        const link = n.tagName === 'P' ? n.querySelector('a[href]') : null;
        if (link) {
          link.className = 'offering-showcase-content-item-link';
          const text = el('p', 'offering-showcase-content-item-link-text');
          text.append(...link.childNodes);
          link.append(text, arrow());
          textCol.append(link);
        } else textCol.append(n);
      });
    });
    item.append(iconBox, textCol);
    content.append(item);
  });
  container.append(titleBlock, content);
  block.replaceChildren(container);
}
