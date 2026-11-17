/**
 * new-event-detail — event page masthead: title + description, a banner image and the event
 * facts panel (date, time, location, free text) on a dark or blue band (source
 * div.new-event-detail.new-event-detail--hub / --sub; main.css @new-event-detail,
 * @event-block, @masthead-quaternary, @row/@column rules).
 *   hub: full-width image, then the band: title + description (two-thirds) | facts (one-third)
 *   sub: title + description above, then the band: image (two-thirds) | facts (one-third)
 *        (the band is row-reversed >= 58.75rem: facts left, image right)
 *
 * Authoring rows (classified by content, defensive — any order, rows may be missing):
 *   - a picture                          -> the banner image; a second picture is its portrait-
 *     orientation crop (source <source media="(orientation: portrait)">)
 *   - a heading (the page's single <h1>) + paragraphs -> title + description
 *   - key/value fact rows, `key | value` or `key | label | value`:
 *       date | time | language | location | info  (see blocks/event-detail; time: shown text
 *       <p> + screen-reader text <p>; location: place or map link; info: free rich text)
 * @variants hub | sub (layout, source --hub / --sub); dark | blue (band theme, source
 *   .dark-theme / .blue-theme); passed (source .event-passed aside)
 *
 * Decode tier: template-slotted — canon skeleton (header / masthead-quaternary media / row
 *   banner > two-thirds + one-third aside > event-block); authored nodes MOVED into slots.
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

function masthead(picture, portrait) {
  const section = el('section', 'masthead-quaternary');
  let node = section;
  ['container', 'inner', 'inner-wrap', 'media', 'video-control'].forEach((part) => {
    const child = el('div', `masthead-quaternary-${part}`);
    node.append(child);
    node = child;
  });
  if (picture) node.append(picture);
  if (picture && portrait) {
    // art direction: the source <picture> swaps to its (orientation: portrait) crop
    picture.classList.add('masthead-quaternary-landscape');
    portrait.classList.add('masthead-quaternary-portrait');
    node.append(portrait);
  }
  return section;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .event-detail-banner')) return; // EW9 re-entrant

  const facts = [];
  let picture = null;
  let portrait = null;
  let title = null;
  const text = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    if (cells.length > 1 && KEYS.includes(key)) {
      facts.push([key, cells.slice(1)]);
      return;
    }
    cells.flatMap((c) => [...c.children]).forEach((n) => {
      const pic = n.tagName === 'PICTURE' ? n : n.querySelector('picture');
      if (pic && !n.textContent.trim() && !picture) picture = pic;
      else if (pic && !n.textContent.trim() && !portrait) portrait = pic;
      else if (/^H[1-6]$/.test(n.tagName) && !title) title = n;
      else if (n.textContent.trim()) text.push(n);
    });
  });

  const hub = block.classList.contains('hub');
  block.classList.add(`new-event-detail-${hub ? 'hub' : 'sub'}`);
  const theme = block.classList.contains('dark') ? 'dark-theme' : 'blue-theme';

  const banner = el('div', `row event-detail-banner ${theme}`);
  const main = el('div', 'two-thirds column');
  const side = el('div', 'one-third column');
  const aside = el('aside', 'event-detail-info');
  if (block.classList.contains('passed')) aside.classList.add('event-passed');
  if (facts.length) aside.append(eventBlock(facts));
  side.append(aside);

  const out = [];
  if (hub) {
    out.push(masthead(picture, portrait));
    const wrap = el('div', 'event-detail-banner-wrapper');
    if (title) {
      title.classList.add('event-detail-banner-title');
      wrap.append(title);
    }
    text.forEach((p) => p.classList.add('event-detail-banner-description'));
    wrap.append(...text);
    main.append(wrap);
  } else {
    const header = el('div', 'new-event-detail-header');
    if (title) header.append(title);
    text.forEach((p) => p.classList.add('new-event-detail-header-text'));
    header.append(...text);
    out.push(header);
    main.append(masthead(picture, portrait));
  }
  banner.append(main, side);
  out.push(banner);
  block.replaceChildren(...out);
}
