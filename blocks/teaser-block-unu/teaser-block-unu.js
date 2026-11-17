/**
 * teaser-block-unu — one full-card link teasing a related piece (report, article): image
 * with a type badge, title, text and an arrowed link label (source div.teaser-block-unu;
 * main.css lifted in prototypes/css/article.css).
 *
 * Authoring rows (classified by content, defensive — one cell or many):
 *   - optional: a heading BEFORE the picture — the block header title (source __header__title)
 *   - a picture — the teaser image
 *   - a short paragraph BEFORE the heading — the type badge (e.g. "Informe")
 *   - a heading (<h2>) — the title
 *   - paragraphs after the heading without a link — the text
 *   - a paragraph holding a link — the link label; its href is the whole card's target
 *     (no label: a link on the title heading is the card's target)
 *
 * @variants block class: dark (default light grey card); badge icon: whitepaper | news |
 *   insight (default whitepaper — the source sprite symbol in front of the badge); blank-icon
 *   (the source references an empty symbol "#icon-": the icon box stays, nothing drawn)
 * Decode tier: template-slotted — canon skeleton inner > a.teaser > media + description;
 *   authored nodes MOVED in; the authored anchor is unwrapped into the card link (EW6).
 */

const ICONS = ['whitepaper', 'news', 'insight'];

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function spriteIcon(name, className) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  if (className) svg.setAttribute('class', className);
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${window.hlx?.codeBasePath || ''}/icons/sprite.svg#icon-${name}`);
  svg.append(use);
  return svg;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .teaser-block-unu-inner')) return; // EW9 re-entrant

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  // a heading authored BEFORE the picture is the block's header title (source
  // .teaser-block-unu__header, e.g. "Mars' success story"), not the card title
  const firstPic = nodes.findIndex((n) => n.matches('picture, img') || n.querySelector('picture, img'));
  const header = /^H[1-6]$/.test(nodes[0]?.tagName || '') && firstPic > 0 ? nodes.shift() : null;
  let picture = null;
  let heading = null;
  let linkPara = null;
  const badge = [];
  const text = [];
  nodes.forEach((node) => {
    const pic = node.matches('picture, img') ? node : node.querySelector('picture, img');
    if (pic && !node.textContent.trim() && !picture) {
      picture = pic;
    } else if (/^H[1-6]$/.test(node.tagName) && !heading) {
      heading = node;
    } else if (node.querySelector('a[href]') && !linkPara) {
      linkPara = node;
    } else if (!heading) {
      badge.push(node);
    } else {
      text.push(node);
    }
  });

  // no link label: the card target may ride on the title link (source card without label)
  const link = linkPara?.querySelector('a[href]') || heading?.querySelector('a[href]');
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'teaser-block-unu-teaser';
  if (link) {
    card.href = link.getAttribute('href');
    if (link.target) card.target = link.target;
    link.classList.remove('button');
    linkPara?.classList.remove('button-wrapper');
    link.querySelectorAll('.before, .after').forEach((s) => s.remove());
    link.replaceWith(...link.childNodes); // EW6: no nested anchors
  }

  const media = div('teaser-block-unu-media');
  if (picture) media.append(picture);
  if (badge.length) {
    const icon = block.classList.contains('blank-icon') ? ''
      : ICONS.find((n) => block.classList.contains(n)) || 'whitepaper';
    media.append(div('teaser-block-unu-media-icon', spriteIcon(icon), ...badge));
  }

  const description = div('teaser-block-unu-description');
  if (heading) description.append(div('teaser-block-unu-title', heading));
  if (text.length) description.append(div('teaser-block-unu-text', ...text));
  if (linkPara) {
    description.append(div('teaser-block-unu-link', linkPara, spriteIcon('arrow-right')));
  } else if (link) {
    // title-borne card link: the source still paints the link line (empty <p> + arrow)
    description.append(div('teaser-block-unu-link', document.createElement('p'), spriteIcon('arrow-right')));
  }

  card.append(media, description);
  const head = header ? [div('teaser-block-unu-header', header)] : [];
  block.replaceChildren(...head, div('teaser-block-unu-inner', card));
}
