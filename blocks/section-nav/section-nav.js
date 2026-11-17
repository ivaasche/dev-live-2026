/**
 * section-nav — a blue band listing links to sibling pages, one large row per link with an
 * arrow (source section.section-nav; main.css section-nav rules).
 *
 * Authoring rows (classified by content, defensive):
 *   - a heading -> the title (source h2.section-nav__title)
 *   - a list (or paragraphs) of links -> the items, in authored order
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton container > title + list >
 *   item > link (label span + arrow); the authored anchors MOVED in (EW1), their text wrapped.
 * @ew-exempt the arrow icon (source sprite #icon-arrow-link) carries no authored text.
 */

const SPRITE = () => `${window.hlx?.codeBasePath || ''}/icons/sprite.svg`;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function arrow() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'section-nav-item-icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${SPRITE()}#icon-arrow-link`);
  svg.append(use);
  return svg;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .section-nav-container')) return; // EW9
  const container = el('div', 'section-nav-container');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.classList.add('section-nav-title');
    container.append(heading);
  }
  const list = el('ul', 'section-nav-list');
  block.querySelectorAll('a[href]').forEach((a) => {
    const li = el('li', 'section-nav-item');
    a.className = 'section-nav-item-link';
    const label = el('span');
    label.append(...a.childNodes);
    a.append(label, arrow());
    li.append(a);
    list.append(li);
  });
  container.append(list);
  block.replaceChildren(container);
}
