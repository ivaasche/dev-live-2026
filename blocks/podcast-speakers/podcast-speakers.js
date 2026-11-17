/**
 * podcast-speakers — "Our experts" row: a title, then round portraits with name, role and
 * social links. Source module div.podcast-speakers (main.css @357180–360118,
 * prototype css/campaign.css).
 *
 * Authoring rows (reconstructive, classified by content, defensive):
 *   - a row holding only a heading -> the block title; a heading row with paragraphs after the
 *     heading (no image) -> title + pitch (source __pitch)
 *   - every other row = one speaker: an image, then paragraphs — the first is the name, the
 *     second the role/company, a paragraph of links = the social links, any further
 *     paragraphs = the description; a paragraph holding an authored CTA (a.button, e.g.
 *     **_Contact John_**) = the speaker button (source __button tertiary pill).
 *
 * Variant classes: `blue` = the source blue-theme band (white on #002fa7); `dark` = the
 * source dark-theme band (white on #000).
 * Decode tier: reconstructive (repeat group) — canon wrapper / title / container / info
 * skeleton; authored nodes MOVED into it (EW1).
 * @ew-exempt the social link text (e.g. "LinkedIn") is kept in the anchor as a visually
 *   hidden label and mirrored to its title; the anchor shows the network icon, as the source.
 */

const ICONS = {
  linkedin: 'icon-linkedin',
  mailto: 'icon-email',
};

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function iconFor(a) {
  const key = Object.keys(ICONS).find((k) => a.href.toLowerCase().includes(k)
    || a.textContent.toLowerCase().includes(k));
  return key ? ICONS[key] : null;
}

function decorateLink(a) {
  const label = document.createElement('span');
  label.className = 'podcast-speakers-link-label';
  label.append(...a.childNodes);
  a.className = 'podcast-speakers-link';
  if (!a.title) a.title = label.textContent.trim();
  a.target = '_blank';
  a.rel = 'noopener';
  a.append(label);
  const icon = iconFor(a);
  if (icon) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `/icons/sprite.svg#${icon}`);
    svg.append(use);
    a.append(svg);
  }
}

function isLinkParagraph(p) {
  const links = [...p.querySelectorAll('a')];
  const linkText = links.map((a) => a.textContent).join('').trim();
  return links.length > 0 && p.textContent.replace(/\s+/g, '') === linkText.replace(/\s+/g, '');
}

function speaker(nodes) {
  const info = div('podcast-speakers-info');
  const media = nodes.filter((n) => n.matches('picture, img')
    || (n.querySelector('picture, img') && !n.textContent.trim()));
  const rest = nodes.filter((n) => !media.includes(n));
  const buttons = rest.filter((n) => n.tagName === 'P' && n.querySelector('a.button'));
  const links = rest.filter((n) => !buttons.includes(n) && n.tagName === 'P' && isLinkParagraph(n));
  const texts = rest.filter((n) => !links.includes(n) && !buttons.includes(n));

  media.forEach((m) => {
    const image = div('podcast-speakers-image');
    image.append(m);
    info.append(image);
  });
  const name = div('podcast-speakers-name');
  if (texts[0]) name.append(texts[0]);
  const company = div('podcast-speakers-company');
  if (texts[1]) company.append(texts[1]);
  const social = div('podcast-speakers-social-links');
  links.forEach((p) => {
    p.querySelectorAll('a').forEach(decorateLink);
    social.append(p);
  });
  const description = div('podcast-speakers-description');
  description.append(...texts.slice(2));
  info.append(name, company, social, description);
  if (buttons.length) {
    const button = div('podcast-speakers-button');
    button.append(...buttons);
    info.append(button);
  }
  return info;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .podcast-speakers-inner')) return; // EW9 re-entrant

  const inner = div('podcast-speakers-inner');
  const head = div('podcast-speakers-wrapper');
  const list = div('podcast-speakers-container');

  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    if (!nodes.length) return;
    const onlyHeading = nodes.every((n) => /^H[1-6]$/.test(n.tagName));
    const headWithPitch = /^H[1-6]$/.test(nodes[0].tagName)
      && !nodes.some((n) => n.matches('picture, img') || n.querySelector('picture, img'));
    if (onlyHeading || headWithPitch) {
      const title = div('podcast-speakers-title');
      const pitch = nodes.filter((n) => !/^H[1-6]$/.test(n.tagName));
      title.append(...nodes.filter((n) => !pitch.includes(n)));
      head.append(title);
      if (pitch.length) {
        const p = div('podcast-speakers-pitch');
        p.append(...pitch);
        head.append(p);
      }
      return;
    }
    list.append(speaker(nodes));
  });

  if (head.children.length) inner.append(head);
  inner.append(list);
  block.replaceChildren(inner);
}
