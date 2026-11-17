/**
 * breadcrumbs — page trail (source div.site-breadcrumbs).
 *
 * Authoring rows (defensive):
 *   one cell holding a list: every item a link to an ancestor page, the last item the
 *   current page as plain text. Bare links/paragraphs without a list are folded into
 *   one list (each paragraph becomes one item).
 *
 *   Optional: a row holding a heading (an <h1> for a page whose source has no visible h1 —
 *   the one-h1 delivery contract) is MOVED after the trail, visually hidden (0 px).
 *
 * Decode tier: template-slotted — canon skeleton site-breadcrumbs > container > nav;
 * the authored list is MOVED into the nav. The last item gets aria-current="page".
 * @ew-exempt the nav aria-label "You are here" is the source's fixed landmark label.
 */

export default function decorate(block) {
  const title = block.querySelector('h1, h2, h3, h4, h5, h6');
  let list = block.querySelector('ul, ol');
  if (!list) {
    const paras = [...block.querySelectorAll('p')];
    if (!paras.length) return;
    list = document.createElement('ul');
    paras.forEach((p) => {
      const li = document.createElement('li');
      li.append(p);
      list.append(li);
    });
  }

  block.classList.add('site-breadcrumbs');
  const container = document.createElement('div');
  container.className = 'site-breadcrumbs-inner';
  const nav = document.createElement('nav');
  nav.className = 'site-breadcrumbs-list';
  nav.setAttribute('aria-label', 'You are here');
  container.append(nav);
  nav.append(list);

  const items = [...list.children];
  const last = items[items.length - 1];
  if (last && !last.querySelector('a')) last.setAttribute('aria-current', 'page');

  block.replaceChildren(container);
  if (title) {
    title.classList.add('visually-hidden');
    block.append(title);
  }
}
