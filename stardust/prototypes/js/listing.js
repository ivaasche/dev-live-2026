/* valtech.com replica — LISTING archetype behaviours (observed on the live
   /es-es/blog/ page, stardust/replica/motion/es-es-blog.json):
   1. filter drop-downs: click toggles the option list (.is-open), one at a
      time, outside click / close button closes;
   2. sticky filter band >= 1024px: the source's scroll handler
      (insights_overview.js) — fixed under the header when the list scrolls
      past, slid down by the header height while scrolling up, hidden once
      the list has scrolled out, released when scrolled back. */
(function () {
  'use strict';

  /* ---------- drop-downs ---------- */
  var selects = Array.prototype.slice.call(document.querySelectorAll('.react-select'));
  function close(sel) {
    sel.classList.remove('is-open');
    var b = sel.querySelector('.react-select__button');
    if (b) b.setAttribute('aria-expanded', 'false');
  }
  selects.forEach(function (sel) {
    var btn = sel.querySelector('.react-select__button');
    var x = sel.querySelector('.react-select__close');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !sel.classList.contains('is-open');
        selects.forEach(close);
        if (open) { sel.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    }
    if (x) x.addEventListener('click', function (e) { e.stopPropagation(); close(sel); });
  });
  document.addEventListener('click', function (e) {
    selects.forEach(function (sel) { if (!sel.contains(e.target)) close(sel); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') selects.forEach(close); });

  /* ---------- sticky filter ---------- */
  var outer = document.querySelector('.insights-overview__inner');
  var box = document.querySelector('.insights-filter__sticky');
  var bar = document.querySelector('.site-nav__menu-fixed');
  if (!outer || !box) return;
  var mqMobile = window.matchMedia('(max-width: 63.9375rem)');
  var lastY = 0, stuck = false, releasing = false;

  function onScroll() {
    var y = window.scrollY;
    var barRect = bar ? bar.getBoundingClientRect() : null;
    var oRect = outer.getBoundingClientRect();
    var top = oRect.top, h = oRect.height;
    var u = box.getBoundingClientRect().height;
    var c = -u;
    var f = barRect ? barRect.height : 0;
    var up = y < lastY;
    if (mqMobile.matches) {
      stuck = false;
      box.classList.remove('is-filter-sticky');
      box.style.transform = 'translate3d(0, 0, 0)';
      outer.style.paddingTop = '0';
      box.style.position = 'relative';
      box.style.top = '0';
      lastY = y;
      return;
    }
    if (h + top - u < 0) {
      box.style.transform = 'translate3d(0, -' + u + 'px, 0)';
    } else if (top < c) {
      if (!stuck) {
        stuck = true;
        box.classList.add('is-filter-sticky');
        outer.style.paddingTop = u + 'px';
        box.style.position = 'fixed';
        box.style.top = '-' + u + 'px';
        setTimeout(function () { box.style.top = '0'; }, 10);
      }
      box.style.transform = up ? 'translate3d(0, ' + f + 'px, 0)' : 'translate3d(0, 0, 0)';
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
        setTimeout(function () { box.style.transition = ''; releasing = false; }, 0);
      }
    } else {
      box.style.transform = 'translate3d(0, ' + u + 'px, 0)';
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}());
