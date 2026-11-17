/**
 * latest-podcast-block — dark band featuring the newest episode: band title, episode title,
 * guest name | company, description, "read more" link, and the episode player
 * (source div.latest-podcast-block.dark-theme; main.css @362577–365636). /es-es/podcasts.
 *
 * Authoring rows (classified by content, defensive):
 *   - a row holding only an <h2>               -> the band title
 *   - the episode row: heading (episode title), paragraphs (1. guest name, 2. company,
 *     further = description), a paragraph holding only a link (the read-more link)
 *   - a row holding a player link (w.soundcloud.com / open.spotify.com / youtube) -> embedded
 *     as the player iframe (the authored link stays as the iframe's fallback text)
 *
 * Decode tier: template-slotted — container > title + row(text column, player column);
 * authored nodes MOVED in.
 */

const PLAYER = /^https:\/\/(w\.soundcloud\.com|open\.spotify\.com|www\.youtube\.com)\//;

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

export default function decorate(block) {
  const container = div('latest-podcast-block-container');
  const text = div('latest-podcast-block-column');
  const media = div('latest-podcast-block-column');
  const people = div('latest-podcast-block-text');
  let title = null;
  let paras = 0;

  [...block.children].forEach((row) => {
    const player = [...row.querySelectorAll('a[href]')].find((a) => PLAYER.test(a.href));
    if (player) {
      const frame = document.createElement('iframe');
      frame.src = player.href;
      frame.title = player.textContent.trim();
      frame.setAttribute('allow', 'autoplay');
      frame.loading = 'lazy';
      media.append(div('podcast-iframe', frame));
      return;
    }
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    nodes.forEach((node) => {
      const link = node.querySelector('a[href]');
      if (node.tagName === 'H2' && !title) {
        title = node;
        node.classList.add('latest-podcast-block-title');
      } else if (/^H[1-6]$/.test(node.tagName)) {
        node.classList.add('latest-podcast-block-podcast-title');
        text.append(node);
      } else if (link && node.textContent.trim() === link.textContent.trim()) {
        link.classList.add('latest-podcast-block-link');
        text.append(node);
      } else {
        paras += 1;
        if (paras === 1) node.classList.add('latest-podcast-block-name');
        else if (paras === 2) node.classList.add('latest-podcast-block-company');
        else node.classList.add('latest-podcast-block-description');
        if (paras <= 2) people.append(node);
        else text.append(node);
      }
    });
  });
  if (people.childNodes.length) {
    const heading = text.querySelector('.latest-podcast-block-podcast-title');
    if (heading) heading.after(people);
    else text.prepend(people);
  }
  if (title) container.append(title);
  container.append(div('latest-podcast-block-row', text, media));
  block.replaceChildren(container);
}
