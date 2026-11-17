/**
 * event-detail — event page body: a two-thirds rich-text column (the event description) and a
 * one-third sticky aside with the event facts (date, time, location, free text); below
 * 58.75rem the aside is hidden and the same facts show above the text (source
 * div.container.event-detail > .row > .two-thirds (.event-detail__mobile + section.rte-block)
 * + .one-third (aside.event-detail__info > .event-block); main.css @event-detail, @event-block,
 * @rte-block, @text-content, @row/@column rules).
 *
 * Authoring rows (classified by content, defensive — any order, rows may be missing):
 *   - key/value fact rows, `key | value` or `key | label | value`:
 *       date     | [label |] the date                     (source .event-block__date)
 *       time     | [label |] shown time <p> + accessible  (second paragraph = screen-reader
 *                                                         text, visually hidden as the source)
 *       language | [label |] the language
 *       location | [label |] place, or a link to the map  (map pin icon added)
 *       info     | free rich text (partners, logos)       (source .event-block__free-text)
 *   - any other row — the event description (rich text: headings, paragraphs, lists)
 * @variants passed — the source's .event-passed aside (no top offset)
 *
 * Decode tier: template-slotted — canon skeleton container > row > two-thirds (mobile facts +
 *   rte) + one-third (aside facts); authored nodes MOVED into their slots; the mobile facts
 *   copy is a clone of the aside facts, as the source renders the event-block twice.
 * @variants first cell key: date | time | language | location | info
 * @ew-exempt the key cells (date, time, language, location, info) are metadata (never shown)
 */

const KEYS = ['date', 'time', 'language', 'location', 'info'];
const SPRITE = () => `${window.hlx?.codeBasePath || ''}/icons/sprite.svg`;
const NS = 'http://www.w3.org/2000/svg';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

// a cell's authored element (a bare-text cell is MOVED into a <p>); it is kept, classed and
// painted inline by the block CSS — never retagged
function para(cell, className) {
  let p = cell.children.length === 1 ? cell.firstElementChild : null;
  if (!p) {
    p = el('p');
    p.append(...cell.childNodes);
  }
  if (className) p.classList.add(className);
  return p;
}

function icon(name) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', `${SPRITE()}#icon-${name}`);
  svg.append(use);
  return svg;
}

function fact(key, cells) {
  if (key === 'info') {
    const free = el('div', 'event-block-free-text');
    free.append(...cells[cells.length - 1].childNodes);
    return free;
  }
  const item = el('div', `event-block-${key}`);
  const value = cells[cells.length - 1];
  if (cells.length > 1 && cells[0].textContent.trim()) {
    item.append(para(cells[0], `event-block-${key}-label`), ' ');
  }
  if (key === 'time') {
    const span = el('span', 'event-block-time-value');
    const paras = [...value.querySelectorAll(':scope > p')];
    if (paras.length > 1) {
      // second paragraph = the screen-reader text (source span.visually-hidden), shown first
      paras[1].classList.add('visually-hidden');
      paras[0].classList.add('event-block-time-display');
      paras[0].setAttribute('aria-hidden', 'true');
      span.append(paras[1], paras[0]);
    } else span.append(para(value));
    item.append(span);
  } else if (key === 'location' && value.querySelector('a')) {
    const p = para(value, 'event-block-location-link');
    const a = p.querySelector('a');
    a.classList.add('event-block-location-value');
    a.target = '_blank';
    a.prepend(icon('location'));
    item.append(p);
  } else {
    item.append(para(value, `event-block-${key}-value`));
  }
  return item;
}

function eventBlock(facts) {
  const eb = el('div', 'event-block text-content');
  const container = el('div', 'event-block-container');
  const text = el('div', 'event-block-text-wrapper');
  facts.forEach(([key, cells]) => text.append(fact(key, cells)));
  container.append(text, el('div', 'event-block-calendar-wrapper'));
  eb.append(container);
  return eb;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return; // EW9 re-entrant

  const facts = [];
  const body = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    if (cells.length > 1 && KEYS.includes(key)) facts.push([key, cells.slice(1)]);
    else cells.forEach((c) => body.push(...c.childNodes));
  });

  const container = el('div', 'container');
  const rowEl = el('div', 'row');
  const main = el('div', 'two-thirds column');
  const side = el('div', 'one-third column');
  const aside = el('aside', 'event-detail-info');
  if (block.classList.contains('passed')) aside.classList.add('event-passed');

  if (facts.length) {
    const eb = eventBlock(facts);
    const mobile = el('div', 'event-detail-mobile');
    const clone = eb.cloneNode(true);
    // EW4: the mobile copy is a presentational clone — strip the editor instrumentation
    clone.querySelectorAll('*').forEach((n) => [...n.attributes]
      .filter((a) => /^data-(prose|image)-/.test(a.name)).forEach((a) => n.removeAttribute(a.name)));
    mobile.append(clone);
    main.append(mobile);
    aside.append(eb);
  }
  if (body.length) {
    const rte = el('section', 'rte-block');
    const inner = el('div', 'rte-block-container text-content');
    inner.append(...body);
    rte.append(inner);
    main.append(rte);
  }
  side.append(aside);
  rowEl.append(main, side);
  container.append(rowEl);
  block.replaceChildren(container);
}
