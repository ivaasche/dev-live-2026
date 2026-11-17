/**
 * jobs — the career job-list teaser: a grey panel listing open positions (title | city, each
 * row one link) with a "see all" pill and a large vertical watermark word, next to an image
 * with a title and text (source div.jobs > __container > __list (a.row > .eight.column h4 +
 * .four.column h5, __list__actions, svg text) + __media (picture + __media__text); main.css).
 *
 * Authoring rows (classified by content, defensive):
 *   - two cells, the first holding a link — one job: title link | city
 *   - a lone link paragraph — the "see all" pill (source button--secondary-hollow)
 *   - a picture with text — the media column (picture, heading title, paragraph)
 *   - a lone text paragraph without link — the watermark word (source svg <text>)
 * Decode tier: reconstructive (repeat group) — authored links, headings and pictures MOVED
 *   into the canon slots.
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .jobs-container')) return; // already decorated
  const list = el('div', 'jobs-list');
  const media = el('div', 'jobs-media');
  const actions = el('div', 'jobs-list-actions');
  let word = '';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const pic = row.querySelector('picture');
    if (pic) {
      media.append(pic);
      const text = el('div', 'jobs-media-text');
      cells.forEach((c) => {
        text.append(...[...c.childNodes].filter((n) => n.nodeType === 1 || n.textContent.trim()));
      });
      text.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => h.classList.add('jobs-media-text-title'));
      if (text.textContent.trim()) media.append(text);
      return;
    }
    const link = cells[0]?.querySelector('a[href]');
    if (cells.length > 1 && link) {
      const a = el('a', 'row');
      a.href = link.href;
      const left = el('div', 'eight column');
      const title = el('h4', 'jobs-list-title');
      title.append(...link.childNodes);
      left.append(title);
      const right = el('div', 'four column');
      const city = el('h5', 'jobs-list-city');
      const src = cells[1].querySelector('h1, h2, h3, h4, h5, h6, p') || cells[1];
      city.append(...src.childNodes);
      right.append(city);
      a.append(left, right);
      list.append(a);
      return;
    }
    if (link) {
      link.className = 'button button-secondary-hollow';
      actions.append(link);
      return;
    }
    if (row.textContent.trim()) word = row.textContent.trim();
  });

  if (actions.children.length) list.append(actions);
  if (word) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 313 598.5');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('writing-mode', 'tb-rl');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '0%');
    text.textContent = word;
    svg.append(text);
    list.append(svg);
  }
  const container = el('div', 'jobs-container');
  container.append(list);
  if (media.children.length) container.append(media);
  block.replaceChildren(container);
}
