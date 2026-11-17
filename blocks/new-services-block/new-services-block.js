/**
 * new-services-block — linked edition cards in rows of two: a black text panel (title + link
 * line with an arrow) beside a cover image (source div.new_services-block > __container >
 * __row > a.__service-link-wrapper > .__service > .__service-content + .__service-image;
 * main.css new_services-block rules).
 *
 * Authoring rows (one card per row, classified by content, defensive):
 *   - a picture (any cell)               -> the card image
 *   - a heading (its link = the card link) -> the card title
 *   - any other paragraph                -> the link line text
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton inner > row (pairs) > card;
 *   authored nodes MOVED in (EW1).
 */

function div(className, ...kids) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...kids);
  return el;
}

function spriteIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${window.hlx?.codeBasePath || ''}/icons/sprite.svg#icon-${name}`);
  svg.append(use);
  return svg;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .new-services-block-inner')) return; // EW9 re-entrant
  const cards = [];
  [...block.children].forEach((row) => {
    const picture = row.querySelector('picture') || row.querySelector('img');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const link = row.querySelector('a[href]');
    if (!heading && !picture) return;
    const card = document.createElement(link ? 'a' : 'div');
    card.className = 'new-services-block-service-link-wrapper';
    if (link) {
      card.href = link.getAttribute('href');
      if (heading && heading.contains(link)) link.replaceWith(...link.childNodes);
    }
    const content = div('new-services-block-service-content');
    if (heading) {
      heading.classList.add('new-services-block-service-title');
      content.append(div('new-services-block-service-title-wrapper', heading));
    }
    const text = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
    const linkBox = div('new-services-block-service-link');
    text.forEach((p) => {
      p.classList.add('new-services-block-service-link-text');
      p.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
      linkBox.append(p);
    });
    content.append(div('new-services-block-service-link-container', linkBox, div('new-services-block-service-link-arrow', spriteIcon('arrow-right'))));
    const service = div('new-services-block-service', content);
    if (picture) {
      const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
      if (img) img.classList.add('new-services-block-service-pictures');
      service.append(div('new-services-block-service-image', picture.closest('picture') || picture));
    }
    card.append(service);
    cards.push(card);
  });
  const inner = div('new-services-block-inner');
  for (let i = 0; i < cards.length; i += 2) inner.append(div('new-services-block-row', ...cards.slice(i, i + 2)));
  block.replaceChildren(inner);
}
