/**
 * Header — the valtech.com site navigation (canon `nav.site-nav`), template-slotted.
 *
 * Authored document: /nav (English) or /<locale>/nav (see chromePath in scripts.js), sections
 * classified by content, not by index:
 *   brand     — a link holding the `:valtech-logo:` icon
 *   menu      — one list: top items = labels (text or <p>), nested list = their links
 *   tools     — paragraphs with links: the search link (href contains /search), the side tab
 *               (href starts with #) and the mobile "Contact Us" bar (any other link)
 *   locations — a title paragraph, the global link paragraph, then one list: top items =
 *               regions, nested list = places, each place link led by a `:xx:` flag icon
 * Active label: page metadata `nav-active` (label text) gets the coral marker + aria-current.
 *
 * Behaviour follows the source header contract (stardust/chrome/header-contract.json):
 * >= 64rem labels open the drop-down on hover and click, an outside click closes it; the
 * location chooser toggles (Escape closes it and returns focus, scroll locked); < 64rem the
 * burger opens the full-screen menu (accordions); sticky bar morph on scroll up.
 *
 * @ew-exempt <p> search link text (tools) — text-as-metadata: becomes the icon's aria-label
 * @ew-exempt all — desktop label buttons and accordion buttons are presentational clones
 *   (EW4) of the authored labels, which stay editable in the overview list
 */
import { loadFragment } from '../fragment/fragment.js';
import { chromePath, getLocale } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/aem.js';

const CODE = window.hlx?.codeBasePath || '';
const SPRITE = `${CODE}/icons/sprite.svg`;
const FLAGS = `${CODE}/icons/flags.svg`;
const SVG_NS = 'http://www.w3.org/2000/svg';
const mqMobile = window.matchMedia('(max-width: 63.999rem)');

/* ---------- small DOM helpers ---------- */

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  node.append(...children);
  return node;
}

function svgUse(href, attrs = {}) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  Object.entries(attrs).forEach(([k, v]) => svg.setAttribute(k, v));
  const use = document.createElementNS(SVG_NS, 'use');
  if (href) use.setAttribute('href', href);
  svg.append(use);
  return svg;
}

const logoCache = {};
async function fetchSvg(name) {
  if (!logoCache[name]) {
    logoCache[name] = fetch(`${CODE}/icons/${name}.svg`)
      .then((r) => (r.ok ? r.text() : ''))
      .catch(() => '');
  }
  const text = await logoCache[name];
  if (!text) return null;
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  return svg ? document.importNode(svg, true) : null;
}

/** EW4: a presentational clone carries no editor instrumentation */
function stripInstrumentation(node) {
  if (node.nodeType !== 1) return node;
  [node, ...node.querySelectorAll('*')].forEach((n) => {
    ['data-prose-index', 'data-image-index', 'data-block-index'].forEach((a) => n.removeAttribute(a));
  });
  return node;
}

function cloneContent(node) {
  return [...node.childNodes].map((n) => stripInstrumentation(n.cloneNode(true)));
}

function camelId(text, prefix) {
  const words = text.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const id = words.map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w.toLowerCase())).join('');
  return `${prefix}${id}`;
}

/**
 * The label of a top-level list item: an authored <p>, or the leading text nodes, which are
 * MOVED into a span (EW1). Returns the element that now holds the label.
 */
function takeLabel(li) {
  const p = li.querySelector(':scope > p');
  if (p) return p;
  const span = document.createElement('span');
  const lead = [];
  [...li.childNodes].some((n) => {
    if (n.nodeType === 1 && n.matches('ul, ol')) return true;
    lead.push(n);
    return false;
  });
  span.append(...lead);
  li.prepend(span);
  return span;
}

function labelText(node) {
  return node.textContent.replace(/\s+/g, ' ').trim();
}

/* ---------- section classification (by content) ---------- */

function classify(fragment) {
  const sections = [...fragment.querySelectorAll(':scope > .section, :scope > div')];
  const roles = {};
  sections.forEach((section) => {
    if (!roles.brand && section.querySelector('.icon-valtech-logo')) roles.brand = section;
    else if (!roles.locations && section.querySelector('li li .icon')) roles.locations = section;
    else if (!roles.menu && section.querySelector('li li a')) roles.menu = section;
    else if (section.querySelector('a')) (roles.tools ||= []).push(section);
  });
  if (!roles.brand) [roles.brand] = sections;
  return roles;
}

/* ---------- builders ---------- */

async function buildLogo(brand, titleId) {
  const link = brand?.querySelector('a');
  const a = link || el('a', { href: getLocale() ? `/${getLocale()}/` : '/' });
  a.className = 'site-nav-logo-link';
  a.removeAttribute('title');
  const icon = a.querySelector('.icon');
  const svg = await fetchSvg('valtech-logo');
  if (svg) {
    svg.querySelector('title')?.setAttribute('id', titleId);
    svg.setAttribute('aria-labelledby', titleId);
    if (icon) icon.replaceWith(svg);
    else a.prepend(svg);
  }
  return el('div', { class: 'site-nav-logo' }, a);
}

function arrowDown() {
  return svgUse(`${SPRITE}#icon-arrow-down`);
}

function buildMenu(menuSection) {
  const list = menuSection?.querySelector('ul');
  const labels = [];
  if (!list) return { list: el('ul'), labels };
  list.className = 'site-nav-menu-list';
  [...list.children].forEach((li) => {
    li.className = 'site-nav-menu-item';
    const label = takeLabel(li);
    label.classList.add('site-nav-menu-title');
    if (label.tagName === 'SPAN') label.tabIndex = 0;
    const sub = li.querySelector(':scope > ul, :scope > ol');
    const id = camelId(labelText(label), '');
    const btn = el('button', {
      class: 'site-nav-menu-title site-nav-menu-title-button',
      type: 'button',
      'aria-expanded': 'false',
      'aria-controls': id,
    }, ...cloneContent(label), arrowDown());
    li.prepend(btn);
    if (sub) {
      sub.className = 'site-nav-menu-sublist';
      sub.id = id;
      [...sub.children].forEach((s) => {
        s.className = 'site-nav-menu-subitem';
        s.querySelectorAll('a').forEach((a) => {
          if (a.title === a.textContent) a.removeAttribute('title');
        });
        // the pipeline may wrap the link in a <p>; the canon styles `.subitem a`
      });
    }
    labels.push({ li, label, btn });
  });
  return { list, labels };
}

function buildLocations(section) {
  const wrap = el('div', {
    class: 'site-nav-locations',
    id: 'siteNavLocations',
    'aria-labelledby': 'siteNavLocationsTitle',
  });
  if (!section) return wrap;
  const title = el('div', { class: 'site-nav-locations-title', id: 'siteNavLocationsTitle' });
  const areas = section.querySelector('ul');
  const paras = [...section.querySelectorAll('p')].filter((p) => !p.closest('ul'));
  paras.forEach((p) => {
    const a = p.querySelector('a');
    if (a) {
      a.classList.add('global-link', 'site-nav-locations-global-link');
      a.removeAttribute('title');
      const span = el('span');
      span.append(...a.childNodes);
      a.append(span);
    } else {
      p.classList.add('site-nav-locations-title-text');
    }
    if (title.childNodes.length) title.append(' ');
    title.append(p);
  });
  const container = el('div', {
    class: 'site-nav-locations-container',
    role: 'region',
    'aria-label': 'Scrollable container',
    tabindex: '0',
  }, title);
  if (areas) {
    areas.className = 'site-nav-locations-areas';
    [...areas.children].forEach((li) => {
      li.className = 'site-nav-locations-region';
      const authored = takeLabel(li);
      // source: the >= 64rem region title is a (non-interactive) <button>; the nav document is a
      // fetched fragment (never workspace-instrumented), so its text moves into the button
      const label = el('button', { class: 'site-nav-locations-region-title', type: 'button' });
      label.append(...authored.childNodes);
      authored.replaceWith(label);
      const places = li.querySelector(':scope > ul, :scope > ol');
      const id = camelId(labelText(label), '');
      const btn = el('button', {
        class: 'site-nav-locations-region-title site-nav-locations-region-title-button',
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': id,
      }, ...cloneContent(label), arrowDown());
      li.prepend(btn);
      if (places) {
        const box = el('div', { class: 'site-nav-locations-region-places', id });
        places.replaceWith(box);
        box.append(places);
        [...places.children].forEach((item) => {
          item.className = 'site-nav-locations-region-places-item';
          const a = item.querySelector('a');
          if (!a) return;
          a.removeAttribute('title');
          const icon = a.querySelector('.icon');
          const code = icon && [...icon.classList].find((c) => c.startsWith('icon-') && c !== 'icon');
          const span = el('span');
          [...a.childNodes].forEach((n) => {
            if (n !== icon) span.append(n);
          });
          const flag = svgUse(null, { viewBox: '0 0 21 15' });
          if (code) flag.querySelector('use').dataset.href = `${FLAGS}#${code}`;
          if (icon) icon.remove();
          a.append(flag, span);
          if (new URL(a.href, window.location).pathname === '/') a.classList.add('global-link');
        });
      }
    });
    container.append(areas);
  }
  wrap.append(container);
  return wrap;
}

function iconButton(cls, label, ...children) {
  return el('button', { class: cls, type: 'button', 'aria-label': label }, ...children);
}

function locationButton(variant) {
  const btn = iconButton(
    `location-select ${variant}`,
    'Open Location Menu',
    el('div', { class: 'icon-global' }, svgUse(`${SPRITE}#icon-global`, { 'aria-hidden': 'true' })),
    el('div', { class: 'icon-close' }, svgUse(`${SPRITE}#icon-close`, { viewBox: '0 0 24 24', 'aria-hidden': 'true' })),
  );
  btn.setAttribute('aria-controls', 'siteNavLocations');
  btn.setAttribute('aria-expanded', 'false');
  return btn;
}

function searchLink(variant, href, label) {
  return el(
    'a',
    { class: `search-select ${variant}`, href, 'aria-label': label },
    el('div', { class: 'icon-search' }, svgUse(`${SPRITE}#icon-search`)),
  );
}

function burgerButton() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  const g = document.createElementNS(SVG_NS, 'g');
  [['icon-menu__line-top', '7'], ['icon-menu__line-middle', '15']].forEach(([c, y]) => {
    const r = document.createElementNS(SVG_NS, 'rect');
    r.setAttribute('class', c.replace('__', '-'));
    r.setAttribute('width', '100%');
    r.setAttribute('height', '2');
    r.setAttribute('y', y);
    g.append(r);
  });
  svg.append(g);
  const btn = iconButton('icon-menu mobile', 'Open Main Menu', svg);
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'mainMenuDropdown');
  return btn;
}

function slope(which, fill) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', `site-slope site-slope-${which}`);
  svg.setAttribute('viewBox', '0 0 1920 1080');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('aria-hidden', 'true');
  const poly = document.createElementNS(SVG_NS, 'polygon');
  poly.setAttribute('fill', fill);
  poly.setAttribute('points', '1920,0 0,0 0,0 1920,0');
  svg.append(poly);
  return svg;
}

/* ---------- behaviour ---------- */

const FULL = '1920,1080 0,1080 0,0 1920,0';
const MID_T = '1920,800 0,300 0,0 1920,0';
const MID_B = '1920,801 0,301 0,0 1920,0';
const ZERO = '1920,0 0,0 0,0 1920,0';

function tween(poly, from, to, ms, done) {
  if (!poly) {
    if (done) done();
    return;
  }
  const a = from.split(/[ ,]+/).map(Number);
  const b = to.split(/[ ,]+/).map(Number);
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / ms);
    const e = 1 - (1 - k) ** 3;
    const pts = [];
    for (let i = 0; i < a.length; i += 2) {
      pts.push(`${a[i] + (b[i] - a[i]) * e},${a[i + 1] + (b[i + 1] - a[i + 1]) * e}`);
    }
    poly.setAttribute('points', pts.join(' '));
    if (k < 1) requestAnimationFrame(step);
    else if (done) done();
  };
  requestAnimationFrame(step);
}

/** closes every open accordion item inside root (source: panels reopen collapsed) */
function resetAccordions(root) {
  root.querySelectorAll('.active[class*="-region"], .site-nav-menu-item.active').forEach((item) => {
    item.classList.remove('active');
    item.querySelectorAll('[aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    item.querySelectorAll('[style*="max-height"]').forEach((x) => { x.style.maxHeight = ''; });
  });
}

function wire(nav, block, labels) {
  const bar = nav.querySelector('.site-nav-menu-fixed');
  const fixedBlock = nav.querySelector('.js-fixed-menu-block');
  const container = nav.querySelector('.site-nav-menu-container');
  const overview = nav.querySelector('.site-nav-menu-overview');
  const general = nav.querySelector('.site-nav-overlay-content-general');
  const locWrap = nav.querySelector('.site-nav-overlay-content-location');
  const locations = nav.querySelector('.site-nav-locations');
  const burger = nav.querySelector('.icon-menu');
  const slopeTop = block.querySelector('.site-slope-top polygon');
  const slopeBottom = block.querySelector('.site-slope-bottom polygon');
  const barLabels = [...nav.querySelectorAll('.site-nav-menu-labels .site-nav-menu-title')];

  /* 1 — sticky bar (>= 64rem): fixed past its height, slides in on scroll up */
  let lastY = 0;
  const resetY = fixedBlock ? parseFloat(getComputedStyle(fixedBlock).paddingTop) || 0 : 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (mqMobile.matches) {
      lastY = y;
      return;
    }
    const h = nav.offsetHeight;
    if (y > h) {
      nav.style.minHeight = `${h}px`;
      nav.classList.add('ready-to-fixed-menu');
      bar.classList.toggle('fixed-menu', y < lastY);
    } else if (y <= resetY) {
      nav.style.minHeight = 'auto';
      nav.classList.remove('ready-to-fixed-menu');
      bar.classList.remove('fixed-menu');
    }
    lastY = y;
  }, { passive: true });
  mqMobile.addEventListener('change', () => {
    if (!mqMobile.matches) return;
    nav.style.minHeight = 'auto';
    bar.classList.remove('fixed-menu');
    nav.classList.remove('ready-to-fixed-menu');
  });

  const wipe = (open, done) => {
    if (open) {
      tween(slopeBottom, ZERO, MID_B, 300, () => tween(slopeBottom, MID_B, FULL, 400));
      tween(slopeTop, ZERO, MID_T, 300, () => tween(slopeTop, MID_T, FULL, 400, done));
    } else {
      tween(slopeTop, FULL, ZERO, 400);
      tween(slopeBottom, FULL, ZERO, 400, done);
    }
  };

  let openPanel = null; // 'menu' | 'location' | null
  const lock = () => document.body.classList.add('no-scroll', 'menu-open');
  const unlock = () => document.body.classList.remove('no-scroll', 'menu-open');

  /* 2 — desktop drop-down: hover or click opens; an outside click or leaving the nav closes */
  let active = null;
  let byHover = false;
  const current = (l) => l.getAttribute('aria-current') === 'true';
  const closeDropdown = () => {
    container.classList.remove('active');
    overview.style.display = 'none';
    barLabels.forEach((l) => l.classList.toggle('active', current(l)));
    active = null;
  };
  const openDropdown = (l, hover) => {
    if (mqMobile.matches) return;
    barLabels.forEach((o) => o.classList.toggle('active', o === l || current(o)));
    overview.style.display = '';
    container.classList.add('active');
    active = l;
    byHover = hover;
  };
  const enterOpens = !getLocale(); // English tree (header-contract.json): Enter opens the label
  barLabels.forEach((l) => {
    // source: the drop-down opens on pointer hover; on the es tree Enter on a label opens nothing
    // (header-contract-es.json), on the English tree Enter opens it (Offerings: 21 links)
    l.addEventListener('mouseenter', () => openDropdown(l, true));
    if (enterOpens) {
      l.addEventListener('keydown', (ev) => {
        if (ev.key !== 'Enter') return;
        ev.preventDefault();
        openDropdown(l, false);
      });
    }
  });
  nav.addEventListener('mouseleave', () => {
    if (active && byHover) closeDropdown();
  });
  document.addEventListener('click', (ev) => {
    if (active && !nav.contains(ev.target)) closeDropdown();
  });

  /* 3 — location chooser */
  const flagsLoaded = { done: false };
  const loadFlags = () => {
    if (flagsLoaded.done) return;
    flagsLoaded.done = true;
    locations.querySelectorAll('use[data-href]').forEach((u) => u.setAttribute('href', u.dataset.href));
  };
  const locButton = () => nav.querySelector(mqMobile.matches ? '.location-select.mobile' : '.location-select.desktop');
  let locOpener = null;
  const closeLocation = (returnFocus) => {
    const btn = nav.querySelector('.location-select.opened');
    if (btn) {
      btn.classList.remove('opened');
      btn.setAttribute('aria-label', 'Open Location Menu');
      btn.setAttribute('aria-expanded', 'false');
    }
    locations.classList.remove('is-open');
    locations.style.visibility = '';
    resetAccordions(locations);
    locWrap.style.display = '';
    openPanel = null;
    wipe(false, () => {
      if (!openPanel) unlock();
    });
    if (returnFocus && locOpener) locOpener.focus();
  };
  // eslint-disable-next-line no-use-before-define
  const closeMenuSilently = () => closeMenu(true);
  const openLocation = (btn) => {
    if (openPanel === 'menu') closeMenuSilently();
    closeDropdown();
    loadFlags();
    const b = btn || locButton();
    locOpener = b;
    b.classList.add('opened');
    b.setAttribute('aria-label', 'Close Location Menu');
    b.setAttribute('aria-expanded', 'true');
    openPanel = 'location';
    lock();
    locWrap.style.display = 'flex';
    wipe(true);
    locations.classList.add('is-open');
    // the canon transitions visibility; pin it so focus can move into the panel right away
    locations.style.visibility = 'visible';
    locations.querySelector('.site-nav-locations-container')?.focus({ preventScroll: true });
  };
  nav.querySelectorAll('.location-select').forEach((b) => {
    b.addEventListener('click', () => {
      if (openPanel === 'location') closeLocation(false);
      else openLocation(b);
    });
  });

  /* 4 — mobile menu */
  const lines = burger ? [...burger.querySelectorAll('rect')] : [];
  const burgerX = (on) => {
    lines.forEach((l, i) => {
      l.style.transformOrigin = '50% 50%';
      l.style.transformBox = 'fill-box';
      l.style.transform = on ? `translateY(${i ? -4 : 4}px) rotate(${i ? -45 : 45}deg)` : '';
    });
  };
  function closeMenu(silent) {
    openPanel = null;
    burgerX(false);
    burger.setAttribute('aria-label', 'Open Main Menu');
    burger.setAttribute('aria-expanded', 'false');
    general.style.display = '';
    resetAccordions(general);
    if (silent) unlock();
    else {
      wipe(false, () => {
        if (!openPanel) unlock();
      });
    }
  }
  const openMenu = () => {
    if (openPanel === 'location') closeLocation(false);
    openPanel = 'menu';
    burgerX(true);
    burger.setAttribute('aria-label', 'Close Main Menu');
    burger.setAttribute('aria-expanded', 'true');
    // source: the menu is shown at once; the slope wipe runs behind it
    lock();
    general.style.display = 'flex';
    wipe(true);
  };
  burger?.addEventListener('click', () => {
    if (openPanel === 'menu') closeMenu(false);
    else openMenu();
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    // source: Escape closes the location chooser only (the mobile menu ignores it)
    if (openPanel === 'location') closeLocation(true);
  });

  /* accordions: mobile overview sections + location regions */
  const accordion = (items, btnSel, panelSel) => {
    items.forEach((item) => {
      const btn = item.querySelector(btnSel);
      const panel = item.querySelector(panelSel);
      if (!btn || !panel) return;
      btn.addEventListener('click', () => {
        const on = !item.classList.contains('active');
        // measure before the class flips (`.active` sets max-height: none, which cannot animate)
        const h = panel.scrollHeight;
        panel.style.maxHeight = on ? `${h}px` : '';
        item.classList.toggle('active', on);
        btn.setAttribute('aria-expanded', String(on));
      });
    });
  };
  accordion(labels.map((l) => l.li), '.site-nav-menu-title-button', '.site-nav-menu-sublist');
  accordion(
    [...nav.querySelectorAll('.site-nav-locations-region')],
    '.site-nav-locations-region-title-button',
    '.site-nav-locations-region-places',
  );
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await loadFragment(chromePath('nav'));
  if (!fragment) return;
  const roles = classify(fragment);

  const { list, labels } = buildMenu(roles.menu);

  // active label: page metadata `nav-active` (the label text, case-insensitive)
  const activeName = getMetadata('nav-active').trim().toLowerCase();

  // tools: search link, side tab, mobile contact bar (moved as their paragraphs, EW3)
  let search = null;
  let side = null;
  let contact = null;
  (roles.tools || []).forEach((section) => {
    section.querySelectorAll('a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!search && href.includes('/search')) search = a;
      else if (!side && href.startsWith('#')) side = a;
      else if (!contact) contact = a;
    });
  });
  const searchHref = search ? search.getAttribute('href') : '/search/';
  const searchLabel = search ? labelText(search) : 'Go to Search page';

  // desktop bar labels: presentational clones of the authored labels (EW4)
  const barList = el('ul', { class: 'site-nav-menu-list' });
  labels.forEach(({ label, btn }) => {
    const b = el('button', {
      class: 'site-nav-menu-title',
      type: 'button',
      'aria-controls': 'mainMenuDropdown',
    }, ...cloneContent(label));
    if (activeName && labelText(label).toLowerCase() === activeName) {
      [b, btn].forEach((x) => {
        x.classList.add('active');
        x.setAttribute('aria-current', 'true');
      });
    }
    barList.append(el('li', { class: 'site-nav-menu-item' }, b));
  });

  const barLogo = await buildLogo(roles.brand, 'logo-title');
  const overviewLogo = barLogo.cloneNode(true);
  overviewLogo.querySelector('title')?.setAttribute('id', 'logo-title-navigation');
  overviewLogo.querySelector('svg')?.setAttribute('aria-labelledby', 'logo-title-navigation');
  stripInstrumentation(overviewLogo);

  const overview = el(
    'div',
    { class: 'site-nav-menu site-nav-menu-overview', id: 'mainMenuDropdown', style: 'display: none;' },
    overviewLogo,
    list,
  );
  const general = el(
    'div',
    { class: 'site-nav-overlay-content-general' },
    el('div', { class: 'site-nav-menu-container' }, el('div', { class: 'site-nav-menu-wrapper' }, overview)),
  );
  if (contact) {
    contact.className = 'site-nav-contact-us-button';
    contact.removeAttribute('title');
    general.append(contact.closest('p') || contact);
  }

  const nav = el(
    'nav',
    { class: 'site-nav', 'aria-label': 'Main Navigation' },
    el(
      'div',
      { class: 'site-nav-menu-fixed' },
      el(
        'div',
        { class: 'site-nav-menu js-fixed-menu-block' },
        el('div', { class: 'site-nav-menu-wrapper site-nav-menu-labels' }, barLogo, barList),
      ),
    ),
    el(
      'div',
      { class: 'site-nav-icons' },
      searchLink('mobile', searchHref, searchLabel),
      locationButton('mobile'),
      burgerButton(),
      locationButton('desktop'),
      searchLink('desktop', searchHref, searchLabel),
      el(
        'div',
        { class: 'site-nav-overlay' },
        general,
        el('div', { class: 'site-nav-overlay-content-location' }, buildLocations(roles.locations)),
      ),
    ),
    el('span', { class: 'visually-hidden js-nav-announcer', role: 'status' }),
  );

  const skip = el('a', { id: 'skip-link', class: 'skip-link', href: '#valtech-content' }, 'Skip to content');
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'valtech-content';
    main.tabIndex = -1;
  }

  const children = [skip, nav];
  if (side) {
    side.id = 'side-button';
    side.className = 'button';
    side.removeAttribute('title');
    children.push(el('div', { class: 'side-button' }, side.closest('p') || side));
  }
  children.push(slope('bottom', '#002FA7'), slope('top', 'currentColor'));
  block.replaceChildren(...children);

  wire(nav, block, labels);
}
