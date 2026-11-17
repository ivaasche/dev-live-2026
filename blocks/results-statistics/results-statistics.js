/**
 * results-statistics — dark statistic cards (figure + description).
 * Source module div.results-statistics-block (main.css @415900–419926, prototype
 * css/campaign.css + js/campaign.js): >= 64rem a static grid (one column per card);
 * < 64rem a slider (one card per step, next card peeking, line dots + square prev/next).
 *
 * Authoring rows (reconstructive — one row per card, classified by content):
 *   cell 1: the figure (e.g. `80%`), cell 2: the description paragraph(s).
 *   A one-cell row: its first element is the figure, the rest the description.
 *   Optional first row holding only a heading: the block header (source
 *   div.results-statistics-block_header, e.g. "Industry trends").
 * @variants block class: smaller-title (source .results-statistics-block_item_title
 *   .smaller-title, inline font-size 36px — word figures)
 *
 * Decode tier: reconstructive (repeat group) — canon container > viewport > track > item
 * skeleton; the authored figure / description nodes MOVED into each card (EW1).
 * @ew-exempt the slider dots and prev/next buttons carry no authored text (aria labels are
 *   the source's fixed control labels).
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function cardNodes(row) {
  const cells = [...row.children];
  if (cells.length >= 2) {
    return {
      figure: [...cells[0].children].length ? [...cells[0].children] : [],
      content: cells.slice(1).flatMap((c) => [...c.children]),
    };
  }
  const nodes = cells.length ? [...cells[0].children] : [];
  return { figure: nodes.slice(0, 1), content: nodes.slice(1) };
}

export default function decorate(block) {
  if (block.querySelector(':scope > .results-statistics-container')) return; // EW9

  const all = [...block.children].filter((r) => r.textContent.trim());
  // optional header row: one cell holding only a heading (source …-block_header)
  const isHeader = (r) => r.children.length === 1 && r.firstElementChild.children.length > 0
    && [...r.firstElementChild.children].every((n) => /^H[1-6]$/.test(n.tagName));
  const headerRow = all.length > 1 && isHeader(all[0]) ? all[0] : null;
  const rows = headerRow ? all.slice(1) : all;
  let header = null;
  if (headerRow) {
    header = el('div', 'results-statistics-header');
    header.append(...headerRow.firstElementChild.children);
  }
  const container = el('div', 'results-statistics-container two-types-title');
  container.style.setProperty('--stat-cols', String(Math.max(rows.length, 1)));
  const viewport = el('div', 'results-statistics-viewport');
  const track = el('div', 'results-statistics-track');
  viewport.append(track);

  const items = rows.map((row, i) => {
    const { figure, content } = cardNodes(row);
    const item = el('div', `results-statistics-item${i === 0 ? ' is-selected' : ''}`);
    const box = el('div', 'results-statistics-item-container');
    const title = el('div', 'results-statistics-item-title');
    title.append(...figure);
    const body = el('div', 'results-statistics-item-content');
    body.append(...content);
    box.append(title, body);
    item.append(box);
    track.append(item);
    return item;
  });

  const dots = el('ol', 'results-statistics-dots carousel-dots');
  const dotItems = items.map((_, i) => {
    const dot = el('li', `dot${i === 0 ? ' is-selected' : ''}`, { 'aria-label': `Slide ${i + 1}` });
    if (i === 0) dot.setAttribute('aria-current', 'step');
    dots.append(dot);
    return dot;
  });
  const prev = el('button', 'carousel-btn carousel-btn-prev results-statistics-btn', {
    type: 'button', 'aria-label': 'Previous', 'aria-disabled': 'true',
  });
  const next = el('button', 'carousel-btn carousel-btn-next results-statistics-btn', {
    type: 'button', 'aria-label': 'Next',
  });

  container.append(viewport, dots, prev, next);
  block.replaceChildren(...(header ? [header] : []), container);

  // slider < 64rem (source flickity: cellAlign left, no wrap); >= 64rem a static grid
  const mq = window.matchMedia('(width >= 64rem)');
  let index = 0;
  const go = (i) => {
    index = Math.max(0, Math.min(items.length - 1, i));
    const x = mq.matches ? 0 : items[index].offsetLeft - items[0].offsetLeft;
    track.style.transform = x ? `translateX(${-x}px)` : '';
    items.forEach((it, n) => it.classList.toggle('is-selected', n === index));
    dotItems.forEach((d, n) => {
      d.classList.toggle('is-selected', n === index);
      if (n === index) d.setAttribute('aria-current', 'step');
      else d.removeAttribute('aria-current');
    });
    prev.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');
    next.setAttribute('aria-disabled', index === items.length - 1 ? 'true' : 'false');
  };
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  dotItems.forEach((d, n) => d.addEventListener('click', () => go(n)));
  mq.addEventListener('change', () => go(index));
}
