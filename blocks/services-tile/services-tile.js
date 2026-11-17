/**
 * services-tile — the industry / service filter tiles above an overview page (source
 * div.services-tile > p.services-tile__prompt + ul.services-tile__list > li.services-tile__item
 * > a.services-tile__link > span.services-tile__link--text).
 *
 * Authoring rows (each optional, any order):
 *   - a paragraph without a link — the prompt line ("Por favor, utiliza el filtro …")
 *   - a list of links (or link paragraphs) — one tile per link
 *   The active tile is not authored: the link whose path is the current page's path gets the
 *   source's `active` state.
 *
 * Decode tier: reconstructive (repeat group) — every authored link MOVED into a tile.
 */

const norm = (p) => p.replace(/\/+$/, '') || '/';

export default function decorate(block) {
  if (block.querySelector(':scope > .services-tile-list')) return; // already decorated
  const prompt = document.createElement('p');
  prompt.className = 'services-tile-prompt';
  const list = document.createElement('ul');
  list.className = 'services-tile-list';
  const here = norm(window.location.pathname);

  block.querySelectorAll('p').forEach((p) => {
    if (!p.querySelector('a') && p.textContent.trim() && !prompt.textContent) {
      prompt.append(...p.childNodes);
    }
  });
  block.querySelectorAll('a[href]').forEach((a) => {
    const li = document.createElement('li');
    li.className = 'services-tile-item';
    const text = document.createElement('span');
    text.className = 'services-tile-link-text';
    text.append(...a.childNodes);
    a.className = 'services-tile-link';
    a.replaceChildren(text);
    if (norm(new URL(a.href, window.location.href).pathname) === here) {
      li.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
    li.append(a);
    list.append(li);
  });
  block.replaceChildren(...(prompt.textContent.trim() ? [prompt] : []), list);
}
