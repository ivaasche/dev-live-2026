/**
 * expandable-block — a row of image cards, each with a dark title bar; activating the bar
 * expands the card's rich text over the card (source section.expandable-block >
 * __header__title + __container.items-in-row-N > __list > __item--dropdown > __item__wrapper
 * (button.__item__headline + __item__content) + picture; main.css expandable-block rules).
 *
 * Authoring rows (classified by content, defensive):
 *   - a row holding only a heading, before the first card — the block title
 *   - one row per card: a picture and the card text — its first heading is the card title
 *     (moved into the bar), the rest is the expanded content. A card without a heading uses
 *     its first paragraph as the title.
 *   Variant `items-in-row-<n>` sets the desktop column count; default = the card count (2–5).
 *
 * Decode tier: reconstructive (repeat group) — authored pictures, headings and content MOVED
 *   into the canon slots.
 * @ew-exempt the bar's arrow icon and "Back" label are UI chrome (source aria-hidden).
 */

const SPRITE = () => `${window.hlx?.codeBasePath || ''}/icons/sprite.svg`;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function arrow() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${SPRITE()}#icon-arrow-link`);
  svg.append(use);
  return svg;
}

function toggle(item, open) {
  item.classList.toggle('opened', open);
  item.classList.toggle('end-opening', open);
  item.querySelector('.expandable-block-item-headline').setAttribute('aria-expanded', String(open));
  item.closest('.expandable-block-container').classList.toggle('dropdown-opened', open);
}

// < 58.75rem the source row is a Flickity slider: a dots bar (one 30 px segment per cell) and
// the long-arrow prev/next buttons under it; here they drive the scroll-snapped row
function controls(list, items) {
  const dots = el('ol', 'flickity-page-dots');
  items.forEach((item, i) => {
    const li = el('li', 'dot');
    li.setAttribute('aria-label', `Slide ${i + 1}`);
    dots.append(li);
  });
  const btn = (dir) => {
    const b = el('button', `carousel-btn carousel-btn-long carousel-btn-${dir}`);
    b.type = 'button';
    b.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
    return b;
  };
  const prev = btn('prev');
  const next = btn('next');
  const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : list.clientWidth);
  const current = () => Math.round(list.scrollLeft / (step() || 1));
  const update = () => {
    const i = Math.min(items.length - 1, current());
    [...dots.children].forEach((li, n) => li.classList.toggle('is-selected', n === i));
    prev.setAttribute('aria-disabled', String(i === 0));
    next.setAttribute('aria-disabled', String(i === items.length - 1));
  };
  const go = (i) => list.scrollTo({ left: Math.max(0, i) * step(), behavior: 'smooth' });
  prev.addEventListener('click', () => go(current() - 1));
  next.addEventListener('click', () => go(Math.min(items.length - 1, current() + 1)));
  [...dots.children].forEach((li, i) => li.addEventListener('click', () => go(i)));
  list.addEventListener('scroll', update, { passive: true });
  update();
  return [dots, prev, next];
}

export default function decorate(block) {
  if (block.querySelector(':scope > .expandable-block-container')) return; // already decorated
  const rows = [...block.children];
  const header = el('div', 'expandable-block-header');
  const list = el('div', 'expandable-block-list');
  const items = [];

  rows.forEach((row) => {
    const pic = row.querySelector('picture');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (!pic && heading && !items.length && !header.children.length) {
      heading.className = 'expandable-block-header-title';
      header.append(heading);
      return;
    }
    if (!pic && !row.textContent.trim()) return;
    const item = el('div', 'expandable-block-item expandable-block-item-dropdown');
    const wrapper = el('div', 'expandable-block-item-wrapper');
    const button = el('button', 'expandable-block-item-headline');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    const text = el('span', 'expandable-block-item-headline-text');
    const content = el('div', 'expandable-block-item-content');
    const inner = el('div', 'expandable-block-item-content-inner');
    const cells = [...row.children].filter((c) => !c.querySelector('picture'));
    cells.forEach((cell) => {
      if (!cell.firstElementChild && cell.textContent.trim()) {
        const p = el('p');
        p.append(...cell.childNodes);
        cell.append(p);
      }
      inner.append(...cell.childNodes);
    });
    const title = inner.querySelector('h1, h2, h3, h4, h5, h6') || inner.querySelector('p');
    if (title) {
      text.append(...title.childNodes);
      title.remove();
    }
    const icon = el('span', 'expandable-block-item-headline-icon');
    icon.setAttribute('aria-hidden', 'true');
    const back = el('span');
    back.textContent = 'Back';
    icon.append(arrow(), back);
    button.append(text, icon);
    content.append(inner);
    wrapper.append(button, content);
    item.append(wrapper);
    if (pic) {
      pic.querySelector('img')?.classList.add('expandable-block-item-image');
      item.append(pic);
    }
    button.addEventListener('click', () => toggle(item, !item.classList.contains('opened')));
    items.push(item);
    list.append(item);
  });

  const container = el('div', 'expandable-block-container');
  const authored = [...block.classList].find((c) => /^items-in-row-\d$/.test(c));
  const n = Math.min(5, Math.max(2, items.length));
  container.classList.add(authored || `items-in-row-${n}`);
  container.append(list);
  if (items.length > 1) container.append(...controls(list, items));
  block.replaceChildren(...(header.children.length ? [header] : []), container);
}
