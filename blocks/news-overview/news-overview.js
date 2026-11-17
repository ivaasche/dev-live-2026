/**
 * news-overview — the newsroom list (source React island NewsPage on /es-es/noticias/:
 * a giant year heading, then one row per press item — date, title, arrow — and a
 * "Load more" button). Document-first: the items are authored rows; "Load more" tops up
 * from /query-index.json (path prefix of the page, newest first) when the index exists.
 *
 * Authoring rows (classified by content, defensive):
 *   - a year row, 1 cell: a heading (<h2>2026</h2>) — starts a year group;
 *   - item rows, 2 cells: date | link (the press item title);
 *   - the label row, 2 cells: `labels` | list of UI strings (1. load more).
 * @variants first cell key: labels
 * @ew-exempt `labels` key cell — text-as-metadata (never displayed); the label list item is
 *   a presentational clone (EW4) applied to the load-more button
 *
 * Decode tier: reconstructive — canon news-overview skeleton; headings, dates and links
 * MOVED into their slots; the row is the link (EW6 unwrap).
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const CODE = window.hlx?.codeBasePath || '';

const text = (el) => (el ? el.textContent.trim() : '');

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children);
  return el;
}

function arrow() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'svg-arrow-right');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `${CODE}/icons/sprite.svg#icon-arrow-right`);
  svg.append(use);
  return svg;
}

function item(href, dateNodes, titleNodes) {
  const li = document.createElement('li');
  li.className = 'news-item';
  const a = document.createElement('a');
  a.href = href;
  const date = div('news-item-date', ...dateNodes);
  const title = div('news-title', ...titleNodes);
  a.append(div('news-item-text', div(
    'news-item-wrapper',
    div('news-item-paragraph', date, title),
    div('news-item-goto', arrow()),
  )));
  li.append(a);
  return li;
}

function group(heading) {
  const result = div('news-overview-result');
  if (heading) {
    heading.classList.add('news-overview-year');
    heading.dataset.title = text(heading);
    const content = document.createElement('span');
    content.className = 'news-overview-year-content';
    content.append(...heading.childNodes);
    heading.append(content);
    result.append(div('news-overview-subheader', heading));
  }
  const list = document.createElement('ul');
  list.className = 'news-overview-list';
  result.append(list);
  return { result, list };
}

export default function decorate(block) {
  const rows = [...block.children];
  const inner = div('news-overview-inner');
  let current = null;
  let moreLabel = null;
  const shown = new Set();

  rows.forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a[href]');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (!link && cells.length > 1 && text(cells[0]).toLowerCase() === 'labels') {
      [moreLabel] = [...(row.querySelector('ul, ol')?.children || [])];
    } else if (heading && !link) {
      current = group(heading);
      inner.append(current.result);
    } else if (link) {
      if (!current) {
        current = group(null);
        inner.append(current.result);
      }
      const dateCell = cells.length > 1 ? cells[0] : null;
      const dateNodes = dateCell ? [...(dateCell.querySelector('p') || dateCell).childNodes] : [];
      shown.add(new URL(link.href, window.location.href).pathname.replace(/\/$/, ''));
      current.list.append(item(link.href, dateNodes, [...link.childNodes]));
    }
  });

  if (moreLabel) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'load-more';
    more.append(...[...moreLabel.childNodes].map((n) => n.cloneNode(true)));
    let index = null;
    more.addEventListener('click', async () => {
      try {
        if (!index) {
          const prefix = window.location.pathname.replace(/\/$/, '');
          const resp = await fetch(`${CODE}/query-index.json`);
          if (!resp.ok) throw new Error(resp.status);
          index = ((await resp.json()).data || [])
            .filter((d) => d.path?.startsWith(`${prefix}/`) && !shown.has(d.path.replace(/\/$/, '')))
            .sort((a, b) => String(b.publishdate || '').localeCompare(String(a.publishdate || '')));
        }
        const target = current || group(null);
        if (!current) inner.insertBefore(target.result, inner.lastChild);
        index.splice(0, 20).forEach((d) => {
          const t = document.createTextNode(d.title || d.path);
          target.list.append(item(d.path, [document.createTextNode(d.publishdate || '')], [t]));
        });
        if (!index.length) more.hidden = true;
      } catch (e) {
        more.disabled = true;
      }
    });
    inner.append(div('news-overview-footer', more));
  }
  block.replaceChildren(inner);
}
