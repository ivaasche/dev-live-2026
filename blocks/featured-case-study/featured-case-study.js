/**
 * featured-case-study — "Our work" mosaic of case-study cards (source div.featured-case-study):
 * title, a description line with a "View more" link, then full-card links (image, title +
 * arrow, one-line description). 5 cards = the home-page 5/7 · 12 · 7/5 mosaic.
 *
 * Authoring rows (classified by content, defensive):
 *   - a row with a heading and no picture, before the cards — the section title (h2)
 *   - a row of paragraphs before the cards — description text, and a paragraph with the
 *     "View more" link
 *   - every row with a picture — one card: picture(s) (first = mobile rendition, second
 *     = >= 940px rendition; one picture serves both), an h3 holding the card link, a
 *     description paragraph
 *
 * Decode tier: reconstructive (repeat group; canon featured-case-study__item skeleton per
 * card, authored heading / paragraph / pictures MOVED in; card-as-link, the authored anchor
 * is unwrapped into the card (EW6)).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function arrow() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'featured-case-study-item-arrow-icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${window.hlx?.codeBasePath || ''}/icons/sprite.svg#icon-arrow-link`);
  svg.append(use);
  return svg;
}

function card(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const pictures = [...row.querySelectorAll('picture')];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const texts = nodes.filter((n) => n !== heading && !n.querySelector('picture')
    && n.tagName !== 'PICTURE' && n.textContent.trim());
  const link = heading?.querySelector('a[href]')
    || texts.map((t) => t.querySelector('a[href]')).find(Boolean);

  const el = document.createElement(link ? 'a' : 'div');
  el.className = 'featured-case-study-item';
  if (link) {
    el.href = link.getAttribute('href');
    if (link.target) el.target = link.target;
    link.replaceWith(...link.childNodes); // EW6: no nested anchors
  }

  const picture = div('featured-case-study-item-picture');
  pictures.forEach((pic, i) => {
    if (pictures.length > 1) pic.classList.add(i === 0 ? 'mobile' : 'desktop');
    picture.append(pic);
  });

  const content = div('featured-case-study-item-content');
  if (heading) content.append(heading);
  content.append(div('featured-case-study-item-icon-container', arrow()));
  const container = div('featured-case-study-item-container', content);
  if (texts.length) container.append(div('featured-case-study-item-description', ...texts));
  el.append(picture, container);
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .featured-case-study-container')) return; // EW9

  const rows = [...block.children];
  const cardRows = rows.filter((r) => r.querySelector('picture'));
  const head = rows.filter((r) => !cardRows.includes(r));
  const headNodes = head.flatMap((r) => [...r.querySelectorAll(':scope > div > *')]);
  const title = headNodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const linkPara = headNodes.find((n) => n !== title && n.querySelector('a[href]'));
  const text = headNodes.filter((n) => n !== title && n !== linkPara);

  const container = div('featured-case-study-container');
  if (title) container.append(div('featured-case-study-title', title));
  if (text.length || linkPara) {
    const description = div('featured-case-study-description');
    if (text.length) description.append(div('featured-case-study-description-text', ...text));
    if (linkPara) {
      const a = linkPara.querySelector('a[href]');
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      linkPara.classList.remove('button-wrapper');
      description.append(div('featured-case-study-description-link', linkPara));
    }
    container.append(description);
  }
  const cards = cardRows.map(card);
  const items = div('featured-case-study-items', ...cards);
  items.classList.add(`featured-case-study-items-${cards.length}`);
  container.append(items);
  block.replaceChildren(container);
}
