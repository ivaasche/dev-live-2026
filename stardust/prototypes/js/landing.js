/*
 * valtech.com replica — landing archetype behaviour (observed on the live page,
 * options lifted from its bundle):
 *  - hero: background track slides, copy cross-fades (.3s), dots + round
 *    prev/next, autoplay 6 s (wrapAround), copy hover pauses it; screen-reader
 *    status "Slide n of N". The gate freezes slide 1 (captureState); the
 *    autoplay is the delivered behaviour.
 *  - hero title fit: when the copy overflows its adapter box the title is
 *    shrunk in even px steps (source text-adapter, max 48/64/88 px).
 *  - industries slider: prev/next step one cell (wrapAround); < 58.75rem the
 *    viewport height follows the selected cell (flickity setGallerySize).
 */
(function () {
  'use strict';
  var mqMobile = window.matchMedia('(max-width: 58.749rem)');

  /* ---------- hero ---------- */
  var hero = document.querySelector('[data-carousel="hero"]');
  if (hero) {
    var bgTrack = hero.querySelector('.hero-block__bg-track');
    var bgs = hero.querySelectorAll('.hero-block__bg-image');
    var items = hero.querySelectorAll('.hero-block__item');
    var dots = hero.querySelectorAll('.carousel-dots li');
    var status = hero.querySelector('.js-carousel-status');
    var n = items.length, idx = 0, timer = null, paused = false;
    var delay = parseInt(hero.getAttribute('data-autoplay'), 10) || 6000;
    var select = function (i) {
      idx = (i + n) % n;
      bgTrack.style.transform = 'translateX(' + (-100 * idx) + '%)';
      Array.prototype.forEach.call(items, function (el, k) { el.classList.toggle('is-selected', k === idx); });
      Array.prototype.forEach.call(bgs, function (el, k) {
        el.classList.toggle('is-selected', k === idx);
        if (k === idx) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', 'true');
      });
      Array.prototype.forEach.call(dots, function (el, k) {
        el.classList.toggle('is-selected', k === idx);
        if (k === idx) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
      });
      if (status) status.textContent = 'Slide ' + (idx + 1) + ' of ' + n;
    };
    var tick = function () {
      clearTimeout(timer);
      timer = setTimeout(function () { if (!paused) select(idx + 1); tick(); }, delay);
    };
    hero.querySelector('.carousel-btn--next').addEventListener('click', function () { select(idx + 1); tick(); });
    hero.querySelector('.carousel-btn--prev').addEventListener('click', function () { select(idx - 1); tick(); });
    Array.prototype.forEach.call(dots, function (d, k) {
      d.addEventListener('click', function () { select(k); tick(); });
      d.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(k); tick(); }
      });
    });
    var content = hero.querySelector('.hero-block__content');
    content.addEventListener('mouseenter', function () { paused = true; });
    content.addEventListener('mouseleave', function () { paused = false; });
    if (n > 1) tick();

    /* title fit (port of the source text-adapter) */
    var gap = function () { return mqMobile.matches ? 8 : 16; };
    var fitOne = function (adapter) {
      var wrap = adapter.querySelector('.hero-block__item__text-adapter__wrapper');
      var title = wrap && wrap.querySelector('.hero-block__item__title');
      if (!title) return;
      title.style.fontSize = ''; title.style.lineHeight = '';
      var max = parseFloat(getComputedStyle(title).fontSize);
      var g = gap();
      if (adapter.offsetHeight >= wrap.offsetHeight + g) return;
      var text = wrap.querySelector('.hero-block__item__text');
      var tag = wrap.querySelector('.hero-block__item__tag');
      var avail = adapter.offsetHeight - (text ? text.offsetHeight : 0) - (tag ? tag.offsetHeight : 0) - g;
      if (avail <= 0) return;
      var cs = getComputedStyle(title);
      var probe = document.createElement('div');
      probe.className = 'hero-block__item__title';
      probe.style.cssText = 'position:absolute;visibility:hidden;top:-9999px;width:' + title.offsetWidth + 'px;font-family:' + cs.fontFamily +
        ';font-weight:' + cs.fontWeight + ';line-height:1.1;white-space:normal;word-wrap:break-word;margin:0;padding:0;max-width:none';
      probe.innerHTML = title.innerHTML;
      document.body.appendChild(probe);
      var fits = function (px) { probe.style.fontSize = px + 'px'; return probe.offsetHeight <= avail; };
      var best = 16, lo = 18, hi = max;
      while (lo <= hi) {
        var mid = lo + Math.floor((hi - lo) / 2);
        mid -= (max - mid) % 2;
        if (fits(mid)) { best = mid; lo = mid + 2; } else { hi = mid - 2; }
      }
      document.body.removeChild(probe);
      if (best < max && best >= 16) { title.style.fontSize = best + 'px'; title.style.lineHeight = '1.1'; }
    };
    var fitAll = function () { Array.prototype.forEach.call(hero.querySelectorAll('.js-hero-block__item__text-adapter'), fitOne); };
    fitAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitAll, 100); });
  }

  /* ---------- industries slider ---------- */
  var fv = document.querySelector('[data-carousel="verticals"]');
  if (fv) {
    var track = fv.querySelector('.featured-verticals-block__track');
    var viewport = fv.querySelector('.featured-verticals-block__viewport');
    var cells = fv.querySelectorAll('.featured-verticals-block__item');
    var count = cells.length, cur = 0;
    var btns = fv.querySelectorAll('.carousel-btn');
    var size = function () {
      var pic = cells[cur].querySelector('.featured-verticals-block__item__picture');
      if (mqMobile.matches) {
        viewport.style.height = cells[cur].offsetHeight + 'px';
        /* source: controls sit 12px under the selected picture on mobile */
        Array.prototype.forEach.call(btns, function (b) { b.style.top = (pic ? pic.offsetHeight : 0) + 12 + 'px'; });
      } else {
        viewport.style.height = '';
        Array.prototype.forEach.call(btns, function (b) { b.style.top = ''; });
      }
    };
    /* source: a title wider than its box is scaled down to fit */
    var fitTitle = function (cell) {
      var t = cell.querySelector('.featured-verticals-block__item__title');
      if (!t) return;
      t.style.removeProperty('font-size');
      if (t.clientWidth < t.scrollWidth) t.style.fontSize = (t.clientWidth / t.scrollWidth) * parseFloat(getComputedStyle(t).fontSize) + 'px';
    };
    var go = function (i) {
      cur = (i + count) % count;
      var step = cells[0].offsetWidth + parseFloat(getComputedStyle(cells[0]).marginRight);
      track.style.transform = 'translateX(' + (-step * cur) + 'px)';
      Array.prototype.forEach.call(cells, function (c, k) {
        var on = k === cur;
        c.classList.toggle('is-selected', on);
        if (on) c.removeAttribute('aria-hidden'); else c.setAttribute('aria-hidden', 'true');
        Array.prototype.forEach.call(c.querySelectorAll('a'), function (a) { a.setAttribute('tabindex', on ? '0' : '-1'); });
      });
      size();
      fitTitle(cells[cur]);
    };
    fv.querySelector('.carousel-btn--next').addEventListener('click', function () { go(cur + 1); });
    fv.querySelector('.carousel-btn--prev').addEventListener('click', function () { go(cur - 1); });
    size();
    setTimeout(function () { fitTitle(cells[cur]); }, 200);
    window.addEventListener('resize', function () { go(cur); });
  }
})();
