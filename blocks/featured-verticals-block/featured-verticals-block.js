/**
 * featured-verticals-block — one-card-at-a-time slider of featured verticals (source
 * section.featured-verticals-block): square picture with a round hover "Explore" button,
 * then pretitle, title, text and a white pill link; prev/next step one cell (wrapAround);
 * < 58.75rem the viewport height follows the selected cell and the controls sit 12px under
 * its picture; a title wider than its box is scaled down to fit (source behaviour).
 *
 * Authoring rows (classified by content, defensive):
 *   - a row with only a heading (h2), before the cells — the block title
 *   - every row with a picture — one cell: picture(s) (first = portrait rendition, second =
 *     landscape rendition; one picture serves both), a short pretitle paragraph BEFORE the
 *     heading, the heading (h3), the text paragraph(s), a paragraph with the link
 *
 * @variants block class: hidden-title (the title is kept for outline/assistive tech but not
 *   shown — source h2.hide on the home page) | default (title shown)
 * @ew-exempt the round picture button label is an EW4 presentational clone of the cell link.
 * Decode tier: reconstructive (repeat group; canon featured-verticals-block__item skeleton
 * per cell, authored heading / paragraphs / pictures MOVED in).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

function cell(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const pictures = [...row.querySelectorAll('picture')];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const linkPara = nodes.find((n) => n !== heading && n.querySelector('a[href]'));
  const rest = nodes.filter((n) => n !== heading && n !== linkPara
    && n.tagName !== 'PICTURE' && !n.querySelector('picture'));
  const hIdx = nodes.indexOf(heading);
  const pre = rest.filter((n) => hIdx >= 0 && nodes.indexOf(n) < hIdx);
  const text = rest.filter((n) => !pre.includes(n));

  const picture = div('featured-verticals-block-item-picture');
  pictures.forEach((pic, i) => {
    if (pictures.length > 1) pic.classList.add(i === 0 ? 'portrait' : 'landscape');
    picture.append(pic);
  });

  const header = div('featured-verticals-block-item-header');
  if (pre.length) header.append(div('featured-verticals-block-item-pretitle', ...pre));
  if (heading) header.append(div('featured-verticals-block-item-title', heading));
  const footer = div('featured-verticals-block-item-footer');
  if (text.length) footer.append(div('featured-verticals-block-item-text', ...text));
  if (linkPara) {
    const a = linkPara.querySelector('a[href]');
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    linkPara.classList.remove('button-wrapper');
    a.classList.add('featured-verticals-block-item-link', 'btn-white');
    footer.append(linkPara);
    // EW4: the round picture button repeats the cell link (presentational clone)
    const btn = document.createElement('a');
    btn.className = 'featured-verticals-block-item-picture-button';
    btn.href = a.getAttribute('href');
    const label = document.createElement('span');
    label.append(...stripInstrumentation(a.cloneNode(true)).childNodes);
    btn.append(label);
    picture.append(btn);
  }
  const content = div('featured-verticals-block-item-content', header, footer);
  const wrapper = div('featured-verticals-block-item-wrapper', picture, content);
  return div('featured-verticals-block-item', wrapper);
}

function slider(block, content) {
  const mqMobile = window.matchMedia('(width <= 58.749rem)');
  const track = content.querySelector('.featured-verticals-block-track');
  const viewport = content.querySelector('.featured-verticals-block-viewport');
  const cells = [...track.children];
  const count = cells.length;
  const btns = [...content.querySelectorAll('.carousel-btn')];
  let cur = 0;
  const size = () => {
    const pic = cells[cur].querySelector('.featured-verticals-block-item-picture');
    if (mqMobile.matches) {
      viewport.style.height = `${cells[cur].offsetHeight}px`;
      btns.forEach((b) => { b.style.top = `${(pic ? pic.offsetHeight : 0) + 12}px`; });
    } else {
      viewport.style.height = '';
      btns.forEach((b) => { b.style.top = ''; });
    }
  };
  const fitTitle = (c) => {
    const t = c.querySelector('.featured-verticals-block-item-title > *');
    if (!t) return;
    t.style.removeProperty('font-size');
    if (t.clientWidth < t.scrollWidth) {
      const fs = parseFloat(getComputedStyle(t).fontSize);
      t.style.fontSize = `${(t.clientWidth / t.scrollWidth) * fs}px`;
    }
  };
  const go = (i) => {
    cur = (i + count) % count;
    const step = cells[0].offsetWidth + parseFloat(getComputedStyle(cells[0]).marginRight);
    track.style.transform = `translateX(${-step * cur}px)`;
    cells.forEach((c, k) => {
      const on = k === cur;
      c.classList.toggle('is-selected', on);
      if (on) c.removeAttribute('aria-hidden');
      else c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', on ? '0' : '-1'));
    });
    size();
    fitTitle(cells[cur]);
  };
  btns.find((b) => b.classList.contains('carousel-btn-next'))?.addEventListener('click', () => go(cur + 1));
  btns.find((b) => b.classList.contains('carousel-btn-prev'))?.addEventListener('click', () => go(cur - 1));
  go(0);
  setTimeout(() => fitTitle(cells[cur]), 200);
  if (document.fonts) {
    document.fonts.ready.then(() => fitTitle(cells[cur]));
    document.fonts.addEventListener('loadingdone', () => fitTitle(cells[cur]));
  }
  window.addEventListener('resize', () => go(cur));
  // the section is shown after decoration and pictures load lazily: the mobile viewport
  // height follows the selected cell whenever its box changes
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => { size(); fitTitle(cells[cur]); });
    cells.forEach((c) => ro.observe(c));
  }
}

function button(className, label) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.setAttribute('aria-label', label);
  return b;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .featured-verticals-block-inner')) return; // EW9

  const rows = [...block.children];
  const cellRows = rows.filter((r) => r.querySelector('picture'));
  const headNodes = rows.filter((r) => !cellRows.includes(r))
    .flatMap((r) => [...r.querySelectorAll(':scope > div > *')]);

  const inner = div('featured-verticals-block-inner');
  if (headNodes.length) {
    const title = div('featured-verticals-block-title', ...headNodes);
    if (block.classList.contains('hidden-title')) title.classList.add('hide');
    inner.append(title);
  }
  const cells = cellRows.map(cell);
  const track = div('featured-verticals-block-track', ...cells);
  const content = div('featured-verticals-block-content', div('featured-verticals-block-viewport', track));
  content.tabIndex = 0;
  if (cells.length > 1) {
    content.append(
      button('carousel-btn carousel-btn-long carousel-btn-prev', 'Previous'),
      button('carousel-btn carousel-btn-long carousel-btn-next', 'Next'),
    );
  }
  inner.append(div('featured-verticals-block-container', content));
  block.replaceChildren(inner);
  if (cells.length) slider(block, content);
}
