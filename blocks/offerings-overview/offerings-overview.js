/**
 * offerings-overview — the row of sibling-service tabs above an offering page; the tab of the
 * current page is the selected one (source div.offerings_overview > section
 * .offerings_overview-tabs > a.offerings_overview-tabs--tab[--tab-selected] > h3).
 *
 * Authoring rows: one row per tab — a heading (<h3>) holding the link (or a paragraph link).
 *   The selected tab is not authored: the link whose path is the current page's path gets
 *   the source's --tab-selected state.
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton tabs > a.tab > h3; the authored
 *   headings MOVED into the authored anchors (EW1/EW6: anchor unwrapped around its heading).
 */

const norm = (p) => p.replace(/\/+$/, '') || '/';

export default function decorate(block) {
  if (block.querySelector(':scope > .offerings-overview-tabs')) return; // EW9
  const tabs = document.createElement('div');
  tabs.className = 'offerings-overview-tabs';
  const here = norm(window.location.pathname);
  block.querySelectorAll('a[href]').forEach((a) => {
    const holder = a.closest('h1, h2, h3, h4, h5, h6, p');
    const heading = document.createElement('h3');
    heading.append(...a.childNodes);
    if (holder && /^H\d$/.test(holder.tagName)) holder.replaceWith(a);
    a.className = 'offerings-overview-tabs-tab';
    a.append(heading);
    if (norm(new URL(a.href, window.location.href).pathname) === here) {
      a.classList.add('offerings-overview-tabs-tab-selected');
      a.setAttribute('aria-current', 'page');
    }
    tabs.append(a);
  });
  block.replaceChildren(tabs);
}
