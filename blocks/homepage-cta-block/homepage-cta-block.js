/**
 * homepage-cta-block — white call-to-action band of the home page (source
 * section.homepage-cta-block): large title, then a description line and a black pill link
 * side by side (>= 58.75rem).
 *
 * Authoring rows (classified by content, defensive — one cell or many):
 *   - a heading (h2) — the title
 *   - paragraphs without a link — the description
 *   - a paragraph holding a link — the button (painted as the source .btn--black pill)
 *
 * Decode tier: template-slotted (canon homepage-cta-block__container skeleton; authored
 * nodes MOVED in).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .homepage-cta-block-container')) return; // EW9

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const linkPara = nodes.find((n) => n !== heading && n.querySelector('a[href]'));
  const text = nodes.filter((n) => n !== heading && n !== linkPara);

  const container = div('homepage-cta-block-container');
  if (heading) container.append(div('homepage-cta-block-title', heading));
  const details = div('homepage-cta-block-details');
  if (text.length) details.append(div('homepage-cta-block-description', ...text));
  if (linkPara) {
    const a = linkPara.querySelector('a[href]');
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    a.classList.add('btn-black', 'homepage-cta-block-button');
    linkPara.classList.remove('button-wrapper');
    details.append(div('homepage-cta-block-action', linkPara));
  }
  container.append(details);
  block.replaceChildren(container);
}
