/**
 * podcast-subscribe — "subscribe on" platform tiles (source div.podcast-subscribe;
 * main.css @352798–354591). Used by /es-es/podcasts.
 *
 * Authoring rows (classified by content, defensive):
 *   - a row with a paragraph and no link -> the title
 *   - every row holding a link            -> one platform tile: an image (the platform logo)
 *                                            and the link (its label = the tile title)
 *
 * Decode tier: reconstructive — tile skeleton per row; logo and label MOVED in, the tile is
 * the link (EW6 unwrap).
 */

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

export default function decorate(block) {
  const list = div('podcast-subscribe-list');
  let title = null;
  [...block.children].forEach((row) => {
    const link = row.querySelector('a[href]');
    if (!link) {
      const p = row.querySelector('p, h2, h3, h4, h5, h6');
      if (p && !title) {
        title = p;
        p.classList.add('podcast-subscribe-title');
      }
      return;
    }
    const tile = document.createElement('a');
    tile.className = 'podcast-subscribe-item';
    tile.href = link.href;
    const picture = row.querySelector('picture');
    if (picture) tile.append(div('podcast-subscribe-image', picture));
    tile.append(div('podcast-subscribe-label', ...link.childNodes));
    list.append(tile);
  });
  block.replaceChildren(...(title ? [title] : []), list);
}
