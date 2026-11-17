/**
 * hub-nav — the Intelligent Enterprise hub sub-navigation (source div.iehub-nav): a black bar
 * under the header (>= 64rem) listing the hub pages, the current page as plain text, and a
 * white pill CTA; below 64rem only the CTA shows, in a fixed bottom gradient bar. Once the
 * bar's slot scrolls under the viewport top it gets .hub-nav-fixed and, while the site header
 * is slid in (.fixed-menu), moves down by the header height (source sticky-nav behaviour).
 *
 * Authoring rows (classified by content, defensive):
 *   - a list of links — the hub pages, in order; an item without a link =
 *     the current page (source span.iehub-nav__item.active, aria-current="page")
 *   - a paragraph holding one link after the list — the CTA (source .iehub-nav__item--cta)
 *
 * Decode tier: reconstructive (repeat group) — canon nav container; the authored anchors /
 * current-page text MOVED into item slots (EW1).
 */

function el(tag, className, ...nodes) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...nodes);
  return node;
}

function sticky(block, bar) {
  const mqDesk = window.matchMedia('(width >= 64rem)');
  const headerBar = () => document.querySelector('header .site-nav-menu-fixed');
  const sync = () => {
    // a hidden section (EDS shows it once loaded) has no box: never fixed before it lays out
    const fixed = block.offsetParent !== null && block.getBoundingClientRect().top <= 0;
    bar.classList.toggle('hub-nav-fixed', fixed);
    const hb = headerBar();
    const shift = fixed && mqDesk.matches && hb && hb.classList.contains('fixed-menu')
      ? hb.offsetHeight : 0;
    bar.style.transform = shift ? `translateY(${shift}px)` : '';
  };
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  if (window.ResizeObserver) new ResizeObserver(sync).observe(block);
  let observed = false;
  const observe = () => {
    const hb = headerBar();
    if (observed || !hb || !window.MutationObserver) return;
    observed = true;
    new MutationObserver(sync).observe(hb, { attributes: true, attributeFilter: ['class'] });
  };
  observe();
  if (!observed) window.addEventListener('scroll', observe, { passive: true, once: true });
  sync();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hub-nav-container')) return; // EW9 re-entrant

  const nav = el('nav', 'hub-nav-container');
  nav.setAttribute('aria-label', 'Hub');
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  nodes.forEach((node) => {
    if (node.matches('ul, ol')) {
      // the authored list stays (display: contents) — its links are the bar items
      node.classList.add('hub-nav-list');
      [...node.children].forEach((li) => {
        const a = li.querySelector('a[href]');
        if (a) {
          a.className = 'hub-nav-item';
        } else if (li.textContent.trim()) {
          const current = el('span', 'hub-nav-item active', ...li.childNodes);
          current.setAttribute('aria-current', 'page');
          li.append(current);
        }
      });
      nav.append(node);
    } else if (node.querySelector('a[href]')) {
      // a paragraph with a link = the CTA pill (paragraph kept, display: contents)
      node.classList.remove('button-wrapper');
      node.classList.add('hub-nav-cta');
      const a = node.querySelector('a[href]');
      a.className = 'btn-white hub-nav-item hub-nav-item-cta';
      nav.append(node);
    }
  });
  block.replaceChildren(nav);
  sticky(block, nav);
}
