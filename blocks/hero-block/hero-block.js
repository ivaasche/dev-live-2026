/**
 * hero-block — full-bleed hero (source section.hero-block): background image band, copy
 * (title, text, tag, white pill link) and, below 58.75rem, a mobile picture under the copy.
 * Two or more rows = the home-page carousel: background track slides, copy cross-fades
 * (.3 s), dots + round prev/next, autoplay every 6 s (wrapAround; hovering the copy
 * pauses; waits while the document is hidden), screen-reader status "Slide n of N" — the
 * source behaviour (progress.json landing captureState restoreAtDelivery). One row = a
 * static hero (no controls).
 *
 * Authoring: one row per slide, cells classified by content (defensive):
 *   - first picture cell — background renditions: picture 1 = desktop, picture 2 (optional)
 *     = tablet/short-viewport rendition (source <source media> condition, CSS-switched)
 *   - the cell holding the heading — h1/h2 title, then paragraphs: text, tag (the last
 *     plain paragraph when there are two), and a paragraph with the link
 *   - a picture cell after the copy — the mobile picture (< 58.75rem)
 *
 * Decode tier: reconstructive (repeat group, canon hero-block skeleton per slide; authored
 * heading / paragraphs / pictures MOVED into the slots).
 * @ew-exempt carousel controls (dots, prev/next, status) carry no authored text.
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function button(className, label) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.setAttribute('aria-label', label);
  return b;
}

function slotsOf(row) {
  const cells = [...row.children];
  const copyCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6'))
    || cells.find((c) => !c.querySelector('picture') && c.textContent.trim());
  const copyIdx = cells.indexOf(copyCell);
  const bgCell = cells.find((c, i) => c !== copyCell && (copyIdx < 0 || i < copyIdx)
    && c.querySelector('picture'));
  const mobileCell = cells.find((c, i) => c !== copyCell && c !== bgCell && i > copyIdx
    && c.querySelector('picture'));
  return {
    bgs: bgCell ? [...bgCell.querySelectorAll('picture')] : [],
    copy: copyCell ? [...copyCell.children] : [],
    mobile: mobileCell ? mobileCell.querySelector('picture') : null,
  };
}

function buildItem(slots, bare) {
  const nodes = slots.copy;
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const linkPara = nodes.find((n) => n.querySelector && n.querySelector('a[href]'));
  const plain = nodes.filter((n) => n !== heading && n !== linkPara
    && !n.querySelector('picture') && n.textContent.trim());
  const tag = plain.length > 1 ? plain[plain.length - 1] : null;
  const texts = plain.filter((n) => n !== tag);

  const adapterWrap = div('hero-block-item-text-adapter-wrapper');
  if (heading) {
    // source structure <h2><span>…</span></h2>: the authored text moves into an inline span
    // (ie-hub: the source <h1> is bare)
    if (!bare && !heading.querySelector('span')) {
      const span = document.createElement('span');
      span.append(...heading.childNodes);
      heading.append(span);
    }
    adapterWrap.append(div('hero-block-item-title', heading));
  }
  if (texts.length) adapterWrap.append(div('hero-block-item-text', ...texts));
  if (tag) adapterWrap.append(div('hero-block-item-tag', tag));
  const adapter = div('hero-block-item-text-adapter', adapterWrap);

  const wrapper = div('hero-block-item-wrapper', adapter);
  if (linkPara) {
    const link = linkPara.querySelector('a[href]');
    link.classList.remove('button', 'primary', 'secondary', 'accent');
    linkPara.classList.remove('button-wrapper');
    link.classList.add('hero-block-item-link', 'btn-white');
    wrapper.append(div('hero-block-item-link-wrapper', linkPara));
  }
  const item = div('hero-block-item', wrapper);
  if (slots.mobile) {
    slots.mobile.classList.add('hero-block-item-picture');
    item.append(slots.mobile);
  }
  return item;
}

/* source text-adapter: when the copy overflows its box the title shrinks in even px steps */
function fitTitles(block) {
  const mobile = window.matchMedia('(width < 58.75rem)').matches;
  block.querySelectorAll('.hero-block-item-text-adapter').forEach((adapter) => {
    const wrap = adapter.querySelector('.hero-block-item-text-adapter-wrapper');
    const title = wrap.querySelector('.hero-block-item-title');
    if (!title) return;
    title.style.fontSize = '';
    title.style.lineHeight = '';
    const max = parseFloat(getComputedStyle(title).fontSize);
    const gap = mobile ? 8 : 16;
    if (adapter.offsetHeight >= wrap.offsetHeight + gap) return;
    const text = wrap.querySelector('.hero-block-item-text');
    const tag = wrap.querySelector('.hero-block-item-tag');
    const avail = adapter.offsetHeight - (text ? text.offsetHeight : 0)
      - (tag ? tag.offsetHeight : 0) - gap;
    if (avail <= 0) return;
    const cs = getComputedStyle(title);
    // a hidden measuring copy (removed below) — never shown, never edited
    const probe = title.cloneNode(true);
    probe.querySelectorAll('[data-prose-index]')
      .forEach((n) => n.removeAttribute('data-prose-index'));
    probe.style.cssText = 'position:absolute;visibility:hidden;top:-9999px;'
      + `width:${title.offsetWidth}px;`
      + `font-family:${cs.fontFamily};font-weight:${cs.fontWeight};line-height:1.1;white-space:normal;`
      + 'overflow-wrap:break-word;margin:0;padding:0;max-width:none';
    block.append(probe);
    const fits = (px) => {
      probe.style.fontSize = `${px}px`;
      return probe.offsetHeight <= avail;
    };
    let best = 16;
    let lo = 18;
    let hi = max;
    while (lo <= hi) {
      let mid = lo + Math.floor((hi - lo) / 2);
      mid -= (max - mid) % 2;
      if (fits(mid)) {
        best = mid;
        lo = mid + 2;
      } else {
        hi = mid - 2;
      }
    }
    probe.remove();
    if (best < max && best >= 16) {
      title.style.fontSize = `${best}px`;
      title.style.lineHeight = '1.1';
    }
  });
}

function carousel(block, items, bgs) {
  const n = items.length;
  const bgImages = block.querySelector('.hero-block-bg-images');
  const track = block.querySelector('.hero-block-bg-track');
  const dots = document.createElement('ol');
  dots.className = 'carousel-dots';
  const status = document.createElement('span');
  status.className = 'visually-hidden';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  const prev = button('carousel-btn carousel-btn-long carousel-btn-prev', 'Previous');
  const next = button('carousel-btn carousel-btn-long carousel-btn-next', 'Next');
  items.forEach((_, k) => {
    const li = document.createElement('li');
    li.setAttribute('aria-label', `Slide ${k + 1}`);
    li.tabIndex = 0;
    dots.append(li);
  });
  bgImages.append(dots, status, prev, next);

  let idx = 0;
  let timer = null;
  let paused = false;
  const delay = 6000;
  const select = (i, announce = true) => {
    idx = (i + n) % n;
    track.style.transform = `translateX(${-100 * idx}%)`;
    items.forEach((el, k) => el.classList.toggle('is-selected', k === idx));
    bgs.forEach((el, k) => {
      el.classList.toggle('is-selected', k === idx);
      if (k === idx) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
    [...dots.children].forEach((el, k) => {
      el.classList.toggle('is-selected', k === idx);
      if (k === idx) el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
    });
    if (announce) status.textContent = `Slide ${idx + 1} of ${n}`;
  };
  const tick = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!paused) select(idx + 1);
      tick();
    }, delay);
  };
  next.addEventListener('click', () => { select(idx + 1); tick(); });
  prev.addEventListener('click', () => { select(idx - 1); tick(); });
  [...dots.children].forEach((d, k) => {
    d.addEventListener('click', () => { select(k); tick(); });
    d.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        select(k);
        tick();
      }
    });
  });
  const content = block.querySelector('.hero-block-content');
  content.addEventListener('mouseenter', () => { paused = true; });
  content.addEventListener('mouseleave', () => { paused = false; });
  select(0, false);
  // source player (flickity): autoplay waits while the document is hidden
  const play = () => {
    if (document.hidden) clearTimeout(timer);
    else tick();
  };
  document.addEventListener('visibilitychange', play);
  play();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-block-inner')) return; // EW9 re-entrant

  const rows = [...block.children].map(slotsOf).filter((s) => s.copy.length || s.bgs.length);
  const bare = block.classList.contains('ie-hub');
  const items = rows.map((r) => buildItem(r, bare));
  const bgs = rows.map((s) => {
    s.bgs.forEach((pic, i) => {
      if (s.bgs.length > 1) pic.classList.add(i === 0 ? 'desktop' : 'tablet');
    });
    return div('hero-block-bg-image', ...s.bgs);
  });
  bgs.forEach((bg, k) => { bg.style.transform = `translateX(${100 * k}%)`; });

  // LCP: the first slide's renditions load eagerly (source fetchpriority="high")
  const eager = [...(bgs[0]?.querySelectorAll('img') || []),
    ...(items[0]?.querySelectorAll('img') || [])];
  eager.forEach((img) => {
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
  });

  const track = div('hero-block-bg-track', ...bgs);
  const bgImages = div('hero-block-bg-images', div('hero-block-bg-viewport', track));
  const content = div('hero-block-content', div('hero-block-viewport', ...items));
  block.replaceChildren(div('hero-block-inner', bgImages, div('hero-block-container', content)));

  if (items.length > 1) {
    carousel(block, items, bgs);
  } else if (items.length) {
    items[0].classList.add('is-selected');
    bgs[0]?.classList.add('is-selected');
  }

  // the section is shown after decoration: fit the titles whenever the hero gets (or changes)
  // its box and once the fonts are in (the fit never changes the hero's own size)
  let raf;
  const refit = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => fitTitles(block));
  };
  if (window.ResizeObserver) new ResizeObserver(refit).observe(block);
  else window.addEventListener('resize', refit);
  // the brand faces load late (loadLazy below 900px): refit when a face finishes loading
  if (document.fonts) {
    document.fonts.ready.then(refit);
    document.fonts.addEventListener('loadingdone', refit);
  }
}
