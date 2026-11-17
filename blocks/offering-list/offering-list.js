/**
 * offering-list — grid of linked cards: image (with a hover veil), title and short
 * description (source div.offering-list; main.css .offering-list*). Used by the Thread
 * magazine edition pages (whitepaper cluster).
 *
 * Authoring rows (classified by content, defensive — cells may be added or omitted):
 *   - a row holding only a heading, before the first card — the list title (optional)
 *   - one row per card: a picture, a heading holding the card link (the title), any
 *     paragraphs — the description (no link = a card without target)
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton header + container > item >
 *   link > media (picture + veil) + title + description; authored nodes MOVED into the slots,
 *   the authored title anchor becomes the card link (its text MOVED into the title, EW6).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function card(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const picture = row.querySelector('picture');
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const link = heading?.querySelector('a[href]');
  const outer = link || document.createElement('div');
  if (link) {
    link.replaceWith(...link.childNodes);
    link.removeAttribute('title');
  }
  const media = div('offering-list-item-media');
  if (picture) {
    picture.querySelector('img')?.classList.add('offering-list-item-media-image');
    media.append(picture);
  }
  media.append(div('offering-list-item-media-text', document.createElement('span')));
  outer.append(media);
  if (heading) {
    heading.classList.add('offering-list-item-title');
    outer.append(heading);
  }
  nodes.filter((n) => n !== heading && n.tagName === 'P' && !n.querySelector('picture'))
    .forEach((p) => {
      p.classList.add('offering-list-item-description');
      outer.append(p);
    });
  return div('offering-list-item', outer);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .offering-list-container')) return; // EW9 re-entrant

  const rows = [...block.children];
  const header = div('offering-list-header');
  const container = div('offering-list-container');
  rows.forEach((row) => {
    const isTitle = !row.querySelector('picture, a[href]') && row.querySelector('h1, h2, h3, h4, h5, h6');
    if (isTitle && !container.children.length) {
      const h = row.querySelector('h1, h2, h3, h4, h5, h6');
      h.classList.add('offering-list-title');
      header.append(h);
    } else {
      container.append(card(row));
    }
  });
  block.replaceChildren(header, container);
}
