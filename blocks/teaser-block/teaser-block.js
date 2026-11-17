/**
 * teaser-block — "related content" row of image cards: type label with icon, title and an
 * arrow, the image filling the card (source div.teaser-block; main.css @175930–181646).
 * Below 58.75rem the row becomes a slider (the source's Flickity: viewport + slider inset
 * 1.5rem, 270px cells, 4-segment dots bar, long-arrow prev/next buttons).
 *
 * Authoring rows (classified by content, defensive):
 *   - a row holding only a heading, before the first card — the block title
 *   - one row per card: a picture, an icon paragraph `:teaser-<type>:` (the card type:
 *     case, insight, news, event, whitepaper, podcast — moved into the label), the type
 *     label heading and the title heading holding the card link (no link = a card
 *     without target, as the source)
 *   - key/value row `button | <label>` — the "show more" tertiary pill after the row (source
 *     button.teaser-block__show-more-button.button--tertiary; the label MOVED into it)
 *   - card rows AFTER the `button` row — the source's hidden second row
 *     (.teaser-block__second_row), revealed by the button
 *   - key/value row `link | <a>` — the content-hub link (source
 *     a.teaser-block__show-more-button-mobile: shown < 58.75rem, and in place of the button
 *     once the second row is revealed — the source relabels the button into this link)
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton header + container > teaser >
 *   inner (pretitle + hgroup) + image; authored headings and pictures MOVED into the slots;
 *   the authored title anchor is unwrapped into the card link (EW6).
 * @ew-exempt the key cells `button` and `link` are metadata (never displayed)
 */

const SPRITE = () => `${window.hlx?.codeBasePath || ''}/icons/sprite.svg`;
const NS = 'http://www.w3.org/2000/svg';

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

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function svgUse(href, className) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  if (className) svg.setAttribute('class', className);
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', href);
  svg.append(use);
  return svg;
}

function card(nodes) {
  const teaser = el('div', 'teaser-block-teaser');
  const picture = nodes.find((n) => n.matches('picture') || (n.querySelector('picture') && !n.textContent.trim()));
  const iconPara = nodes.find((n) => n.tagName === 'P' && n.querySelector('span.icon')
    && !n.textContent.trim());
  const headings = nodes.filter((n) => /^H[1-6]$/.test(n.tagName));
  const title = headings[headings.length - 1];
  const pretitle = headings.length > 1 ? headings[0] : null;
  const link = title?.querySelector('a[href]');
  const inner = el(link ? 'a' : 'div', 'teaser-block-teaser-inner');
  if (link) {
    inner.href = link.getAttribute('href');
    link.replaceWith(...link.childNodes); // EW6: one card link
  }
  if (pretitle) {
    pretitle.classList.add('teaser-block-teaser-pretitle');
    const icon = iconPara?.querySelector('span.icon');
    if (icon) {
      pretitle.prepend(icon);
      iconPara.remove();
    }
    const type = [...(icon?.classList || [])].find((c) => c.startsWith('icon-'));
    if (icon && type) {
      const name = type.slice(5);
      pretitle.classList.add(name.replace(/^teaser-/, ''));
      icon.replaceChildren(svgUse(`${window.hlx?.codeBasePath || ''}/icons/${name}.svg#icon`));
    }
    inner.append(pretitle);
  }
  if (title) {
    const hgroup = el('hgroup', 'teaser-block-teaser-hgroup');
    title.classList.add('teaser-block-teaser-title');
    hgroup.append(title, svgUse(`${SPRITE()}#icon-arrow-link`, 'teaser-block-teaser-arrow-icon'));
    inner.append(hgroup);
  }
  teaser.append(inner);
  if (picture) {
    const wrap = el('div', 'teaser-block-teaser-image-wrapper');
    wrap.append(picture.matches('picture') ? picture : picture.querySelector('picture'));
    teaser.append(wrap);
  }
  return teaser;
}

function slider(box) {
  const mq = window.matchMedia('(width <= 58.749rem)');
  const cells = [...box.children];
  let built = null;
  let index = 0;
  const update = () => {
    const step = cells[1] ? cells[1].offsetLeft - cells[0].offsetLeft : 0;
    built.track.style.transform = `translateX(${-index * step}px)`;
    cells.forEach((c, i) => c.classList.toggle('is-selected', i === index));
    [...built.dots.children].forEach((li, i) => li.classList.toggle('is-selected', i === index));
    built.prev.setAttribute('aria-disabled', String(index === 0));
    built.next.setAttribute('aria-disabled', String(index === cells.length - 1));
  };
  const go = (i) => {
    index = Math.max(0, Math.min(cells.length - 1, i));
    update();
  };
  const build = () => {
    const viewport = el('div', 'flickity-viewport');
    const track = el('div', 'flickity-slider');
    track.append(...cells);
    viewport.append(track);
    const dots = el('ol', 'flickity-page-dots');
    cells.forEach((_, i) => {
      const li = el('li', 'dot');
      li.setAttribute('aria-label', `Slide ${i + 1}`);
      li.addEventListener('click', () => go(i));
      dots.append(li);
    });
    const btn = (dir) => {
      const b = el('button', `carousel-btn carousel-btn-long carousel-btn-${dir}`);
      b.type = 'button';
      b.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
      b.addEventListener('click', () => go(index + (dir === 'prev' ? -1 : 1)));
      return b;
    };
    const prev = btn('prev');
    const next = btn('next');
    box.classList.add('flickity-enabled');
    box.append(viewport, dots, prev, next);
    built = {
      track, dots, prev, next,
    };
    update();
  };
  const unbuild = () => {
    cells.forEach((c) => c.classList.remove('is-selected'));
    box.replaceChildren(...cells);
    box.classList.remove('flickity-enabled');
    built = null;
    index = 0;
  };
  const sync = () => {
    if (mq.matches && !built) build();
    else if (!mq.matches && built) unbuild();
  };
  sync();
  mq.addEventListener('change', sync);
}

// the source "show more" tertiary pill: the authored label paragraph MOVED into a <button>
function showMore(nodes) {
  const button = el('button', 'button button-tertiary teaser-block-show-more-button');
  button.type = 'button';
  const label = nodes.map((n) => n.textContent.trim()).join(' ');
  nodes.forEach((n) => button.append(...n.childNodes));
  const before = el('span', 'before');
  before.setAttribute('aria-hidden', 'true');
  before.dataset.label = label;
  const after = el('span', 'after');
  after.setAttribute('aria-hidden', 'true');
  button.append(before, after);
  return button;
}

// the content-hub link: the authored anchor MOVED out of its paragraph, painted as the pill
function hubLink(nodes) {
  const a = nodes.map((n) => (n.tagName === 'A' ? n : n.querySelector('a'))).find(Boolean);
  if (!a) return null;
  a.className = 'button button-tertiary teaser-block-show-more-button-mobile';
  const before = el('span', 'before');
  before.setAttribute('aria-hidden', 'true');
  before.dataset.label = a.textContent.trim();
  const after = el('span', 'after');
  after.setAttribute('aria-hidden', 'true');
  a.append(before, after);
  return a;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .teaser-block-container')) return; // EW9 re-entrant

  const header = el('div', 'teaser-block-header');
  const container = el('div', 'teaser-block-container');
  const second = el('div', 'teaser-block-container teaser-block-second-row');
  let button = null;
  let link = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells.length === 2 ? cells[0].textContent.trim().toLowerCase() : '';
    if (key === 'button') {
      button = showMore(cellNodes(cells[1]));
      return;
    }
    if (key === 'link') {
      link = hubLink(cellNodes(cells[1])) || link;
      return;
    }
    const nodes = cells.flatMap((c) => cellNodes(c));
    const isTitle = nodes.length === 1 && /^H[1-6]$/.test(nodes[0].tagName)
      && !container.children.length && !header.children.length && !row.querySelector('picture');
    if (isTitle) {
      nodes[0].classList.add('teaser-block-header-title');
      header.append(nodes[0]);
    } else if (nodes.length) {
      (button ? second : container).append(card(nodes));
    }
  });
  const after = [];
  if (button) {
    const more = el('div', 'teaser-block-show-more');
    if (second.children.length) {
      second.style.display = 'none';
      more.append(second);
    }
    const holder = el('div', 'teaser-block-container');
    holder.append(button);
    more.append(holder);
    after.push(more);
    button.addEventListener('click', () => {
      second.style.display = '';
      if (link) {
        holder.hidden = true;
        link.classList.add('revealed');
      }
    });
  }
  if (link) after.push(link);
  block.replaceChildren(...[header, container].filter((n) => n.children.length), ...after);
  if (container.children.length > 1) slider(container);
}
