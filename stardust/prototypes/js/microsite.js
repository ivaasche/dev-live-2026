/*
 * valtech.com replica — microsite archetype behaviour (Intelligent Enterprise hub pages).
 *  - hub sub-navigation (js-iehub-sticky-nav): once its slot scrolls under the viewport top the
 *    bar gets .iehub-nav--fixed; while the site header is slid in (.fixed-menu) the fixed bar
 *    moves down by the header height (transform .3s, observed in sync with the header).
 *  - hero title fit (as landing): title shrinks in even px steps to fit its adapter.
 *  - related-cases: the details row sits below the card edge at rest; --move-up
 *    (minus the details height) lets hover/focus slide title + details up.
 *  - "Cómo lo hacemos realidad" slider: prev/next step one cell (wrapAround);
 *    < 58.75rem the viewport height follows the selected cell.
 */
(function () {
  'use strict';
  var mqMobile = window.matchMedia('(max-width: 58.749rem)');

  /* ---------- hero title fit (source text-adapter): when tag + title + text overflow the
     adapter box the title shrinks in even px steps, line-height 1.1 — live 360: 48 → 44 px ---------- */
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
    var fitAll = function () { Array.prototype.forEach.call(document.querySelectorAll('.js-hero-block__item__text-adapter'), fitOne); };
    fitAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitAll, 100); });

  /* ---------- hub sub-navigation: sticky bar ---------- */
  var subnav = document.querySelector('.js-iehub-sticky-nav');
  if (subnav) {
    var bar = subnav.querySelector('.iehub-nav__container');
    var headerBar = document.querySelector('.site-nav__menu-fixed');
    var mqDesk = window.matchMedia('(min-width: 64rem)');
    var sync = function () {
      var fixed = subnav.getBoundingClientRect().top <= 0;
      bar.classList.toggle('iehub-nav--fixed', fixed);
      var shift = fixed && mqDesk.matches && headerBar && headerBar.classList.contains('fixed-menu') ? headerBar.offsetHeight : 0;
      bar.style.transform = shift ? 'translateY(' + shift + 'px)' : '';
    };
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    if (headerBar && window.MutationObserver) new MutationObserver(sync).observe(headerBar, { attributes: true, attributeFilter: ['class'] });
    sync();
  }

  /* ---------- related cases: hover lift distance ---------- */
  var cases = document.querySelectorAll('.related-cases__item');
  var setMove = function () {
    Array.prototype.forEach.call(cases, function (item) {
      var d = item.querySelector('.related-cases__item-content-details');
      var c = item.querySelector('.related-cases__item-content');
      /* measured on live (1440: 97 - 33 = 64px, 360: 64 - 20 = 44px): the lift is the details
         height minus the title's layout height (offsetHeight, transform-free) */
      var h = item.querySelector('.related-cases__item-title');
      var lift = d ? Math.max(0, d.offsetHeight - (h ? h.offsetHeight : 0)) : 0;
      if (c) c.style.setProperty('--move-up', -lift + 'px');
    });
  };
  setMove();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setMove);
  window.addEventListener('resize', setMove);

  /* ---------- featured verticals slider ---------- */
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
        Array.prototype.forEach.call(btns, function (b) { b.style.top = (pic ? pic.offsetHeight : 0) + 12 + 'px'; });
      } else {
        viewport.style.height = '';
        Array.prototype.forEach.call(btns, function (b) { b.style.top = ''; });
      }
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
    };
    fv.querySelector('.carousel-btn--next').addEventListener('click', function () { go(cur + 1); });
    fv.querySelector('.carousel-btn--prev').addEventListener('click', function () { go(cur - 1); });
    size();
    window.addEventListener('resize', function () { go(cur); });
  }
})();
