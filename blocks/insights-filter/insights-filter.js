/**
 * insights-filter — content listing with facet filters (source React island InsightsOverview on
 * /es-es/blog/: filter band, result count, card grid, load more). Document-first
 * (dynamics listings § Block contract): the cards are authored rows, the filters narrow them
 * client-side with no network; "load more" tops up from /query-index.json when the index exists.
 *
 * Authoring rows (classified by content, any order):
 *   - facet rows, 2 cells: facet key | list of options (first item = the "all" label shown on
 *     the closed drop-down);
 *   - the result-count row, 1 cell: one paragraph ("10 resultados de un total de 997");
 *   - card rows: picture | heading holding the post link (title attribute kept), excerpt
 *     paragraph, date paragraph, optional tag list (the facet values the card matches);
 *   - the label row, 2 cells: `labels` | list of UI strings (1. load more, 2. close popup).
 *
 * Decode tier: reconstructive — canon insights-overview skeleton; every authored heading,
 * paragraph, picture and list is MOVED into its slot; the card is the link (EW6 unwrap).
 *   - optional title row, 1 cell: a heading without a link (events: "Próximos Eventos").
 *
 * Block variants (class on the block, card shape per source React island; same row shapes):
 *   (none) blog InsightsOverview — excerpt paragraphs, LAST paragraph = date, tags in meta;
 *   cases CasesOverview — every paragraph after the heading is the excerpt, tags in meta;
 *   whitepapers WhitepapersOverview — as cases + a read-more overlay on the image
 *     (labels row item 3);
 *   events EventsPage — paragraph BEFORE the heading = date, paragraphs after = location;
 *   podcasts PodcastFilter — dark horizontal card, paragraph before the heading = type
 *     badge, paragraphs after = link label;
 *   hub HubPage — mosaic of typed cards: paragraph before the heading = content type.
 * @variants block class: cases | whitepapers | events | podcasts | hub
 * @variants facet key cell: industry | offering | platform | aboutus | contenttype | labels
 * @ew-exempt facet key cells and the `labels` key — text-as-metadata (never displayed)
 * @ew-exempt labels row list — UI strings applied to controls (load-more button, popup close);
 *   the drop-down label is a presentational clone (EW4) of the facet's first option, which
 *   stays editable in the option list
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const CODE = window.hlx?.codeBasePath || '';
const STICKY_MQ = '(max-width: 63.9375rem)';
const VARIANTS = ['cases', 'whitepapers', 'events', 'podcasts', 'hub'];
const HUB_ICONS = `${CODE}/blocks/insights-filter/icons.svg`;
// content type of a hub card from its link path (the source's pageType)
const HUB_TYPES = {
  blog: 'insight', eventos: 'event', casos: 'case', noticias: 'news', whitepapers: 'whitepaper', podcasts: 'podcast',
};
function hubType(href) {
  const seg = new URL(href, window.location.href).pathname.split('/')[2];
  return HUB_TYPES[seg] || 'insight';
}

// podcast card link arrow (source inline svg: 31 px rule + chevron)
function arrowLine() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 31.64 6');
  svg.setAttribute('aria-hidden', 'true');
  const rect = document.createElementNS(SVG_NS, 'rect');
  [['y', '2.5'], ['width', '31'], ['height', '1'], ['fill', 'currentColor']].forEach(([k, v]) => rect.setAttribute(k, v));
  const line = document.createElementNS(SVG_NS, 'polyline');
  [['points', '29 0.5 31 3 29 5.5'], ['fill', 'none'], ['stroke', 'currentColor'], ['stroke-linecap', 'round']]
    .forEach(([k, v]) => line.setAttribute(k, v));
  svg.append(rect, line);
  return svg;
}

const text = (el) => (el ? el.textContent.trim() : '');

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

function icon(name, hidden = false, sprite = `${CODE}/icons/sprite.svg`) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  if (hidden) svg.setAttribute('aria-hidden', 'true');
  if (sprite === HUB_ICONS) svg.setAttribute('class', `ii-icon ii-icon-${name}`);
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `${sprite}#${sprite === HUB_ICONS ? 'icon-' : ''}${name}`);
  svg.append(use);
  return svg;
}

// presentational clone without the editor's indices (EW4)
function strippedClone(node) {
  const clone = node.cloneNode(true);
  if (clone.nodeType === 1) {
    clone.removeAttribute('data-prose-index');
    clone.querySelectorAll('[data-prose-index]').forEach((n) => n.removeAttribute('data-prose-index'));
  }
  return clone;
}

function cloneContent(from, to) {
  to.replaceChildren(...[...from.childNodes].map(strippedClone));
}

function classify(rows) {
  const out = {
    facets: [], count: null, cards: [], labels: [], titles: [],
  };
  rows.forEach((row) => {
    const cells = [...row.children];
    const list = row.querySelector('ul, ol');
    const link = row.querySelector('a[href]');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (link) {
      out.cards.push(row);
    } else if (heading && cells.length === 1 && !row.querySelector('p')) {
      out.titles.push(heading);
    } else if (cells.length > 1 && list) {
      const key = text(cells[0]).toLowerCase();
      if (key === 'labels') out.labels = [...list.children];
      else out.facets.push({ key, list });
    } else if (!out.count && row.querySelector('p')) {
      out.count = row.querySelector('p');
    } else if (!out.count && text(row)) {
      const p = document.createElement('p');
      p.append(...cells[0].childNodes);
      out.count = p;
    }
  });
  return out;
}

function buildCard(row, variant, readMore) {
  const link = row.querySelector('a[href]');
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const pictures = [...row.querySelectorAll('picture')];
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture') && !(heading && heading.contains(p)) && text(p));
  // paragraphs authored before the heading (event date, content-type badge)
  const before = heading
    // eslint-disable-next-line no-bitwise
    ? paras.filter((p) => p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)
    : [];
  const after = paras.filter((p) => !before.includes(p));
  const tags = row.querySelector('ul, ol');

  const card = document.createElement('a');
  card.className = 'insight-item';
  card.href = link.href;
  if (link.title) card.title = link.title;
  link.replaceWith(...link.childNodes);

  if (variant === 'hub') card.dataset.type = hubType(link.href);
  if (pictures.length) {
    const media = div('ii-image-wrapper', ...pictures);
    if (variant === 'whitepapers' && readMore) {
      const over = document.createElement('span');
      cloneContent(readMore, over);
      media.append(div('ii-read-more', over));
    }
    card.append(media);
  }
  if (variant === 'hub') {
    // type badge (icon + authored label), title box with arrow; image panel behind
    before.forEach((p) => card.prepend(div('ii-pretitle', icon(card.dataset.type, true, HUB_ICONS), p)));
    card.append(div('ii-content', ...(heading ? [div('ii-title', heading)] : []), icon('arrow-link', true, HUB_ICONS)));
  } else if (variant === 'podcasts') {
    const body = div('ii-content', document.createElement('span'));
    body.firstChild.className = 'ii-rectangle';
    if (heading) body.append(div('ii-title', heading));
    if (readMore) {
      const label = document.createElement('p');
      cloneContent(readMore, label);
      body.append(div('ii-link', label, arrowLine()));
    }
    card.append(body);
  } else if (variant) {
    before.forEach((p) => card.append(div('ii-pretitle', p)));
    if (heading) card.append(div('ii-title', heading));
    after.forEach((p) => card.append(div(variant === 'events' ? 'ii-location' : 'ii-excerpt', p)));
    if (tags) card.append(div('ii-meta', div('ii-meta-item ii-tags', tags)));
  } else {
    before.forEach((p) => card.append(div('ii-pretitle', p)));
    if (heading) card.append(div('ii-title', heading));
    // excerpt first, date last (source order); a single paragraph is the date
    const date = after.length ? after[after.length - 1] : null;
    after.slice(0, -1).forEach((p) => card.append(div('ii-excerpt', p)));
    const meta = div('ii-meta');
    if (date) meta.append(div('ii-meta-item ii-published-date', date));
    if (tags) meta.append(div('ii-meta-item ii-tags', tags));
    card.append(meta);
  }
  if (tags && (variant === 'hub' || variant === 'podcasts')) {
    tags.hidden = true;
    card.append(tags);
  }
  card.dataset.tags = JSON.stringify(tags ? [...tags.children].map(text) : []);
  return card;
}

// content-hub mosaic (HubPage): rows of three, row types cycling 1..5, last row of two
const HUB_ROWS = ['type-1', 'type-2', 'type-3', 'type-4', 'type-5'];
function layoutHub(grid, cards) {
  const visible = cards.filter((c) => !c.hidden);
  const rows = [];
  for (let i = 0; i < visible.length; i += 3) rows.push(visible.slice(i, i + 3));
  grid.replaceChildren(...rows.map((group, i) => {
    const row = div(`hub-row ${HUB_ROWS[i % 5]}${group.length === 2 ? ' last-row-with-two' : ''}`);
    row.append(...group);
    return row;
  }));
  grid.append(...cards.filter((c) => c.hidden));
}

function buildSelect(facet, closeLabel, onChange) {
  const options = [...facet.list.children];
  const select = div('react-select');
  select.dataset.type = facet.key;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'react-select-button';
  button.setAttribute('aria-expanded', 'false');
  const label = div('react-select-label');
  if (options[0]) cloneContent(options[0], label);
  const caret = div('react-select-caret', icon('icon-carret-down'));
  button.append(label, caret);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'react-select-close';
  const closeText = document.createElement('span');
  if (closeLabel) cloneContent(closeLabel, closeText);
  close.append(icon('icon-close', true), closeText);
  const popup = div('react-select-popup', close, div('react-select-options', facet.list));
  select.append(button, popup);

  options.forEach((li, i) => {
    li.tabIndex = 0;
    li.classList.add('react-select-option');
    if (i === 0) li.classList.add('is-selected');
    const choose = () => {
      options.forEach((o) => o.classList.toggle('is-selected', o === li));
      cloneContent(li, label);
      select.dispatchEvent(new CustomEvent('select-close', { bubbles: true }));
      onChange(facet.key, i === 0 ? null : text(li));
    };
    li.addEventListener('click', choose);
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        choose();
      }
    });
  });
  return { select, button, close };
}

function wireSelects(selects) {
  const closeOne = ({ select, button }) => {
    select.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
  };
  selects.forEach((s) => {
    s.button.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !s.select.classList.contains('is-open');
      selects.forEach(closeOne);
      if (open) {
        s.select.classList.add('is-open');
        s.button.setAttribute('aria-expanded', 'true');
      }
    });
    s.close.addEventListener('click', (e) => {
      e.stopPropagation();
      closeOne(s);
    });
    s.select.addEventListener('select-close', () => closeOne(s));
  });
  document.addEventListener('click', (e) => {
    selects.forEach((s) => { if (!s.select.contains(e.target)) closeOne(s); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') selects.forEach(closeOne);
  });
}

// sticky filter band >= 1024px — the source's scroll handler (insights_overview.js)
function wireSticky(outer, box) {
  const mqMobile = window.matchMedia(STICKY_MQ);
  let lastY = 0;
  let stuck = false;
  let releasing = false;
  const onScroll = () => {
    const y = window.scrollY;
    const bar = document.querySelector('.site-nav-menu-fixed');
    const oRect = outer.getBoundingClientRect();
    const { top, height } = oRect;
    const u = box.getBoundingClientRect().height;
    const c = -u;
    const f = bar ? bar.getBoundingClientRect().height : 0;
    const up = y < lastY;
    if (mqMobile.matches) {
      stuck = false;
      box.classList.remove('is-filter-sticky');
      box.style.transform = 'translate3d(0, 0, 0)';
      outer.style.paddingTop = '0';
      box.style.position = 'relative';
      box.style.top = '0';
    } else if (height + top - u < 0) {
      box.style.transform = `translate3d(0, -${u}px, 0)`;
    } else if (top < c) {
      if (!stuck) {
        stuck = true;
        box.classList.add('is-filter-sticky');
        outer.style.paddingTop = `${u}px`;
        box.style.position = 'fixed';
        box.style.top = `-${u}px`;
        setTimeout(() => { box.style.top = '0'; }, 10);
      }
      box.style.transform = up ? `translate3d(0, ${f}px, 0)` : 'translate3d(0, 0, 0)';
    } else if (!stuck || up || (bar && bar.classList.contains('fixed-menu'))) {
      if ((top - f - c > 0 || top - f > 0) && stuck && !releasing) {
        releasing = true;
        box.style.willChange = 'auto';
        box.style.transition = 'none';
        box.style.transform = 'translate3d(0, 0, 0)';
        outer.style.paddingTop = '0';
        box.style.position = 'relative';
        box.style.top = '';
        box.classList.remove('is-filter-sticky');
        stuck = false;
        setTimeout(() => { box.style.transition = ''; releasing = false; }, 0);
      }
    } else {
      box.style.transform = `translate3d(0, ${u}px, 0)`;
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

// index top-up: cards published after the authored rows, newest first, one page per click
function indexCard(item) {
  const card = document.createElement('a');
  card.className = 'insight-item';
  card.href = item.path;
  card.title = item.title || '';
  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title || '';
    img.loading = 'lazy';
    card.append(div('ii-image-wrapper', img));
  }
  const h = document.createElement('h2');
  h.textContent = item.title || '';
  card.append(div('ii-title', h));
  if (item.description) {
    const p = document.createElement('p');
    p.textContent = item.description;
    card.append(div('ii-excerpt', p));
  }
  card.append(div('ii-meta'));
  card.dataset.tags = '[]';
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  const {
    facets, count, cards: cardRows, labels, titles,
  } = classify(rows);
  const [moreLabel, closeLabel, readMore] = labels;
  const variant = VARIANTS.find((v) => block.classList.contains(v)) || '';

  const grid = div('insights-overview-grid');
  const cards = cardRows.map((row) => buildCard(row, variant, readMore));
  grid.append(...cards);

  const total = cards.length;
  const countBox = div('insights-overview-count');
  if (count) countBox.append(count);
  const status = document.createElement('p');
  status.className = 'insights-overview-status';
  status.setAttribute('aria-live', 'polite');
  status.hidden = true;
  countBox.append(status);

  const active = {};
  const apply = (key, value) => {
    if (value) active[key] = value;
    else delete active[key];
    const wanted = Object.values(active);
    let shown = 0;
    grid.querySelectorAll('.insight-item').forEach((card) => {
      const tags = JSON.parse(card.dataset.tags || '[]');
      const match = wanted.every((v) => tags.includes(v));
      card.hidden = !match;
      if (match) shown += 1;
    });
    if (variant === 'hub') layoutHub(grid, cards);
    const filtered = wanted.length > 0;
    if (count) count.hidden = filtered;
    status.hidden = !filtered;
    // derived count (interaction state, not authored): the authored phrase with its first
    // number = matching cards, its last number = authored cards
    if (filtered) {
      const nums = [...text(count).matchAll(/\d[\d.,]*/g)];
      const phrase = text(count);
      status.textContent = nums.length > 1
        ? `${shown}${phrase.slice(nums[0].index + nums[0][0].length, nums.at(-1).index)}${total}`
        : `${shown} / ${total}`;
    }
  };

  const selects = facets.map((f) => buildSelect(f, closeLabel, apply));
  wireSelects(selects);
  // + canon BEM alias: the replica unit family (stardust/replica/units.json) selects it
  const sticky = div('insights-filter-sticky', div(
    'filters-block-content filters-block__content',
    div('insights-filter-selects', ...selects.map((s) => s.select)),
  ));
  const band = document.createElement('section');
  band.className = 'insights-filter-band';
  band.append(sticky);

  const inner = div('insights-overview-inner');
  const heads = titles.map((t) => div('insights-overview-title', t));
  if (variant === 'podcasts') inner.append(...heads, band);
  else inner.append(band, ...heads);
  inner.append(countBox, grid);
  if (variant === 'hub') layoutHub(grid, cards);

  if (moreLabel) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'load-more';
    cloneContent(moreLabel, more);
    ['before', 'after'].forEach((name) => {
      const span = document.createElement('span');
      span.className = name;
      more.append(span);
    });
    let index = null;
    more.addEventListener('click', async () => {
      try {
        if (!index) {
          const prefix = window.location.pathname.replace(/\/$/, '');
          const resp = await fetch(`${CODE}/query-index.json`);
          if (!resp.ok) throw new Error(resp.status);
          const shown = new Set(cards.map((c) => new URL(c.href).pathname.replace(/\/$/, '')));
          index = ((await resp.json()).data || [])
            .filter((d) => d.path?.startsWith(`${prefix}/`) && !shown.has(d.path.replace(/\/$/, '')))
            .sort((a, b) => String(b.publishdate || '').localeCompare(String(a.publishdate || '')));
        }
        grid.append(...index.splice(0, 10).map(indexCard));
        if (!index.length) more.hidden = true;
      } catch (e) {
        more.disabled = true;
      }
    });
    inner.append(div('insights-overview-more', div('insights-overview-more-wrap', more)));
  }

  block.replaceChildren(inner);
  wireSticky(inner, sticky);
}
