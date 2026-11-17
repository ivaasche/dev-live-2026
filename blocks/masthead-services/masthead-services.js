/**
 * masthead-services — split page masthead: title + description left, media right
 * (>= 58.75rem); stacked below (source section.masthead-services; main.css @80714–85126).
 * Used by /es-es/noticias (no media), /es-es/podcasts and /es-es/content-hub.
 *
 * Authoring rows (classified by content, defensive — any order, cells may be missing):
 *   - a heading (the page's single <h1>) -> the title
 *   - a picture                          -> the media panel (empty panel when absent: the
 *                                           source keeps an empty video-block there)
 *   - any other element (paragraphs)     -> the description, in authored order
 *
 * @variants block class: video (the source keeps a video-block in the media panel: the
 *   video-block authored right after this block in the same section is moved into the panel).
 *   A description that is one linked paragraph renders as the source's linked description.
 * Decode tier: template-slotted — content + media columns, authored nodes MOVED in.
 */

const SPRITE = () => `${window.hlx?.codeBasePath || ''}/icons/sprite.svg`;

// a description that is one paragraph holding only a link -> the source's linked description
// (a.masthead-services_content-description-link > p + arrow); the authored anchor and its text
// are MOVED (EW1/EW6)
function linkDescription(description) {
  const only = description.children.length === 1 ? description.firstElementChild : null;
  const link = only?.tagName === 'P' ? only.querySelector('a[href]') : null;
  if (!link || only.textContent.trim() !== link.textContent.trim()) return;
  const p = document.createElement('p');
  p.append(...link.childNodes);
  const arrow = document.createElement('span');
  arrow.className = 'masthead-services-content-arrow';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${SPRITE()}#icon-arrow-right`);
  svg.append(use);
  arrow.append(svg);
  link.className = 'masthead-services-content-description-link';
  link.append(p, arrow);
  only.replaceWith(link);
}

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const content = document.createElement('div');
  content.className = 'masthead-services-content';
  const description = document.createElement('div');
  description.className = 'masthead-services-description';
  const media = document.createElement('div');
  media.className = 'masthead-services-media';

  nodes.forEach((node) => {
    const picture = node.tagName === 'PICTURE' ? node : node.querySelector('picture');
    if (/^H[1-6]$/.test(node.tagName)) {
      node.classList.add('masthead-services-title');
      content.prepend(node);
    } else if (picture && !node.textContent.trim()) {
      media.append(picture);
    } else {
      description.append(node);
    }
  });
  if (description.childNodes.length) content.append(description);
  linkDescription(description);
  block.replaceChildren(content, media);
  // variant `video`: the next block of the section (a video-block) is the media panel
  if (block.classList.contains('video')) {
    const next = block.parentElement?.nextElementSibling;
    if (next?.classList.contains('video-block-wrapper')) media.append(next);
  }
}
