/**
 * related-cases — "Casos": a titled row of case cards (source section.related-cases, ie-hub
 * white variant). Each card is one link: picture, then a black content band with the title;
 * on hover/focus the title scales to 1, the description + tags fade in and the band slides up
 * by --move-up (the details height minus the title's layout height, measured as the source
 * does). The first card hides when the list is narrower than 584px (source container query).
 *
 * Authoring rows (classified by content, defensive):
 *   - a row with only a heading (h2) — the block title (source "/ TITLE" eyebrow)
 *   - one row per case: a picture cell (picture 1 = mobile rendition, picture 2 = >= 940px
 *     rendition; one picture serves both) and a copy cell — heading (h3) holding the case
 *     link, a description paragraph, a list of tags
 *
 * Decode tier: reconstructive (repeat group; canon item > link > image-block + content
 * skeleton, authored nodes MOVED in). The card is the link (EW6 card-as-link): the authored
 * heading anchor's href moves to the card anchor, its text stays in the heading.
 */

function el(tag, className, ...nodes) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...nodes);
  return node;
}

function card(row) {
  const pictures = [...row.querySelectorAll('picture')];
  const nodes = [...row.querySelectorAll(':scope > div > *')]
    .filter((n) => n.tagName !== 'PICTURE' && !n.querySelector('picture'));
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const list = nodes.find((n) => n.tagName === 'UL' || n.tagName === 'OL');
  const texts = nodes.filter((n) => n !== heading && n !== list);
  const anchor = row.querySelector('a[href]');

  const link = el('a', 'related-cases-item-link');
  if (anchor) {
    link.href = anchor.getAttribute('href');
    // EW6: the heading keeps the authored text; the anchor element is unwrapped in place
    if (heading && heading.contains(anchor)) anchor.replaceWith(...anchor.childNodes);
  }

  const image = el('div', 'related-cases-item-image-block');
  pictures.forEach((pic, i) => {
    pic.classList.add('related-cases-item-image-block-static');
    if (pictures.length > 1) pic.classList.add(i === 0 ? 'mobile' : 'desktop');
    image.append(pic);
  });

  const wrapper = el('div', 'related-cases-item-content-wrapper');
  if (heading) {
    heading.classList.add('related-cases-item-title');
    wrapper.append(heading);
  }
  const details = el('div', 'related-cases-item-content-details');
  texts.forEach((p) => p.classList.add('related-cases-item-description'));
  details.append(...texts);
  if (list) {
    list.classList.add('related-cases-item-tags');
    [...list.children].forEach((li) => li.classList.add('related-cases-item-tag'));
    details.append(list);
  }
  wrapper.append(details);
  link.append(image, el('div', 'related-cases-item-content', wrapper));
  return el('li', 'related-cases-item', link);
}

/* source (measured on the live hub pages at 360 / 1024 / 1440): the band always shows two title
   lines — the lift is the details height minus the room a one-line title leaves free
   (2 line-heights - the title's layout height, transform-free); = details - title for a one-line
   title (archetype), = details for a two-line title */
function setMove(block) {
  block.querySelectorAll('.related-cases-item').forEach((item) => {
    const d = item.querySelector('.related-cases-item-content-details');
    const c = item.querySelector('.related-cases-item-content');
    const h = item.querySelector('.related-cases-item-title');
    let free = 0;
    if (h) {
      const cs = getComputedStyle(h);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) || 0;
      free = Math.max(0, 2 * lh - h.offsetHeight);
    }
    const lift = d ? Math.max(0, d.offsetHeight - free) : 0;
    if (c) c.style.setProperty('--move-up', `${-lift}px`);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .related-cases-container')) return; // EW9 re-entrant
  block.classList.add('white-theme');

  const rows = [...block.children];
  const cardRows = rows.filter((r) => r.querySelector('picture')
    || r.querySelector('h3, h4, ul'));
  const headNodes = rows.filter((r) => !cardRows.includes(r))
    .flatMap((r) => [...r.querySelectorAll(':scope > div > *')]);

  const container = el('div', 'related-cases-container');
  if (headNodes.length) {
    headNodes.forEach((n) => { if (/^H[1-6]$/.test(n.tagName)) n.classList.add('related-cases-title'); });
    container.append(el('div', 'related-cases-header', ...headNodes));
  }
  container.append(el('ul', 'related-cases-list', ...cardRows.map(card)));
  block.replaceChildren(container);

  let raf;
  const refit = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => setMove(block));
  };
  if (window.ResizeObserver) new ResizeObserver(refit).observe(block);
  else window.addEventListener('resize', refit);
  if (document.fonts) document.fonts.ready.then(refit);
}
