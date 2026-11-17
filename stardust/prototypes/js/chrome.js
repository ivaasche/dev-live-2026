/*
 * valtech.com replica — shared chrome behaviour (canon, frozen with canon.css).
 * Only behaviours observed on the live site (stardust/replica/motion/index*.json)
 * and lifted from its bundle (homepage.js):
 *  1. ≥ 64rem sticky header: past the bar height the nav gets
 *     `ready-to-fixed-menu` (bar becomes fixed, parked above the viewport);
 *     scrolling UP adds `fixed-menu` on .site-nav__menu-fixed (slides in),
 *     scrolling down removes it; back at the top both are cleared.
 *  2. ≥ 64rem label click → drop-down overview (.site-nav__menu__container.active).
 *  3. Location button → full-screen wipe (.site-slope) + location chooser,
 *     body.no-scroll.menu-open, button.opened (globe flips to close icon).
 *  4. < 64rem burger → hamburger morphs to ×, wipe, full-screen menu with
 *     accordion sections; the fixed "Contact Us" bar sits at the bottom.
 *  5. < 58.75rem contact band accordion (.contact-us-form__container.active).
 */
(function () {
  'use strict';
  var mqMobile = window.matchMedia('(max-width: 63.999rem)');
  var nav = document.querySelector('.site-nav');
  if (!nav) return;
  var bar = nav.querySelector('.site-nav__menu-fixed');
  var block = nav.querySelector('.js-fixed-menu-block');
  var container = nav.querySelector('.site-nav__menu__container');
  var general = nav.querySelector('.site-nav__overlay__content-general');
  var locWrap = nav.querySelector('.site-nav__overlay__content-location');
  var locations = nav.querySelector('.site-nav__locations');
  var burger = nav.querySelector('.icon-menu');
  var slopeTop = document.querySelector('.site-slope--top polygon');
  var slopeBottom = document.querySelector('.site-slope--bottom polygon');
  var labels = Array.prototype.slice.call(nav.querySelectorAll('.site-nav__menu__labels .site-nav__menu__title'));
  var overview = nav.querySelector('.site-nav__menu__overview');

  /* 1 — sticky header (lifted: threshold = bar height, reset at block padding-top) */
  var lastY = 0;
  var resetY = block ? parseFloat(getComputedStyle(block).paddingTop) || 0 : 0;
  function onScroll() {
    var y = window.scrollY;
    if (mqMobile.matches) { lastY = y; return; }
    var h = nav.offsetHeight;
    if (y > h) {
      nav.style.minHeight = h + 'px';
      nav.classList.add('ready-to-fixed-menu');
      bar.classList.toggle('fixed-menu', y < lastY);
    } else if (y <= resetY) {
      nav.style.minHeight = 'auto';
      nav.classList.remove('ready-to-fixed-menu');
      bar.classList.remove('fixed-menu');
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  mqMobile.addEventListener('change', function () {
    if (mqMobile.matches) {
      nav.style.minHeight = 'auto';
      bar.classList.remove('fixed-menu');
      nav.classList.remove('ready-to-fixed-menu');
    }
  });

  /* wipe: animate the slope polygons like the source GSAP timeline */
  var FULL = '1920,1080 0,1080 0,0 1920,0';
  var MID_T = '1920,800 0,300 0,0 1920,0';
  var MID_B = '1920,801 0,301 0,0 1920,0';
  var ZERO = '1920,0 0,0 0,0 1920,0';
  function parse(p) { return p.split(/[ ,]+/).map(Number); }
  function fmt(a) { var o = []; for (var i = 0; i < a.length; i += 2) o.push(a[i] + ',' + a[i + 1]); return o.join(' '); }
  function tween(poly, from, to, ms, done) {
    if (!poly) { if (done) done(); return; }
    var a = parse(from), b = parse(to), t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      poly.setAttribute('points', fmt(a.map(function (v, i) { return v + (b[i] - v) * e; })));
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    })(t0);
  }
  function wipe(open, done) {
    if (open) {
      tween(slopeBottom, ZERO, MID_B, 300, function () { tween(slopeBottom, MID_B, FULL, 400); });
      tween(slopeTop, ZERO, MID_T, 300, function () { tween(slopeTop, MID_T, FULL, 400, done); });
    } else {
      tween(slopeTop, FULL, ZERO, 400);
      tween(slopeBottom, FULL, ZERO, 400, done);
    }
  }

  var openPanel = null; // 'menu' | 'location' | null
  function lockOpen() { document.body.classList.add('no-scroll', 'menu-open'); }
  function unlock() { document.body.classList.remove('no-scroll', 'menu-open'); }

  /* 3 — location chooser */
  function locationButton() { return nav.querySelector(mqMobile.matches ? '.location-select.mobile' : '.location-select.desktop'); }
  function openLocation() {
    if (openPanel === 'menu') closeMenu(true);
    closeDropdown();
    var btn = locationButton();
    btn.classList.add('opened');
    btn.setAttribute('aria-label', 'Close Location Menu');
    openPanel = 'location';
    wipe(true, function () {
      lockOpen();
      locWrap.style.display = 'flex';
      requestAnimationFrame(function () { locations.classList.add('is-open'); });
    });
  }
  function closeLocation() {
    var btn = nav.querySelector('.location-select.opened');
    if (btn) { btn.classList.remove('opened'); btn.setAttribute('aria-label', 'Open Location Menu'); }
    locations.classList.remove('is-open');
    locWrap.style.display = '';
    openPanel = null;
    wipe(false, unlock);
  }
  Array.prototype.forEach.call(nav.querySelectorAll('.location-select'), function (b) {
    b.addEventListener('click', function () { openPanel === 'location' ? closeLocation() : openLocation(); });
  });

  /* 4 — mobile menu */
  var lineTop = burger && burger.querySelector('.icon-menu__line-top');
  var lineMid = burger && burger.querySelector('.icon-menu__line-middle');
  function burgerX(on) {
    [lineTop, lineMid].forEach(function (l, i) {
      if (!l) return;
      l.style.transformOrigin = '50% 50%';
      l.style.transformBox = 'fill-box';
      l.style.transition = 'transform .4s ease-out';
      l.style.transform = on ? 'translateY(' + (i ? -4 : 4) + 'px) rotate(' + (i ? -45 : 45) + 'deg)' : '';
    });
  }
  function openMenu() {
    if (openPanel === 'location') closeLocation();
    openPanel = 'menu';
    burgerX(true);
    burger.setAttribute('aria-label', 'Close Main Menu');
    wipe(true, function () { lockOpen(); general.style.display = 'flex'; });
  }
  function closeMenu(silent) {
    openPanel = null;
    burgerX(false);
    burger.setAttribute('aria-label', 'Open Main Menu');
    general.style.display = '';
    if (silent) { unlock(); return; }
    wipe(false, unlock);
  }
  if (burger) burger.addEventListener('click', function () { openPanel === 'menu' ? closeMenu() : openMenu(); });

  /* 2 — desktop drop-down */
  var activeLabel = null;
  function closeDropdown() {
    if (!container) return;
    container.classList.remove('active');
    if (overview) overview.style.display = 'none';
    labels.forEach(function (l) { l.classList.remove('active'); l.setAttribute('aria-expanded', 'false'); });
    activeLabel = null;
  }
  labels.forEach(function (l) {
    l.setAttribute('aria-expanded', 'false');
    l.addEventListener('click', function () {
      if (mqMobile.matches) return;
      if (activeLabel === l) { closeDropdown(); return; }
      labels.forEach(function (o) { o.classList.remove('active'); o.setAttribute('aria-expanded', 'false'); });
      l.classList.add('active');
      l.setAttribute('aria-expanded', 'true');
      if (overview) overview.style.display = '';
      container.classList.add('active');
      activeLabel = l;
    });
  });
  document.addEventListener('click', function (ev) {
    if (activeLabel && !nav.contains(ev.target)) closeDropdown();
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    if (activeLabel) closeDropdown();
    else if (openPanel === 'menu') closeMenu();
    else if (openPanel === 'location') closeLocation();
  });

  /* accordions: mobile overview sections + location regions */
  function accordion(root, itemSel, btnSel, panelSel) {
    Array.prototype.forEach.call(root.querySelectorAll(itemSel), function (item) {
      var btn = item.querySelector(btnSel), panel = item.querySelector(panelSel);
      if (!btn || !panel) return;
      btn.addEventListener('click', function () {
        var on = !item.classList.contains('active');
        item.classList.toggle('active', on);
        btn.setAttribute('aria-expanded', String(on));
        panel.style.maxHeight = on ? panel.scrollHeight + 'px' : '';
      });
    });
  }
  accordion(nav, '.site-nav__menu__overview .site-nav__menu__item', '.site-nav__menu__title--button', '.site-nav__menu__sublist');
  accordion(nav, '.site-nav__locations__region', '.site-nav__locations__region__title--button', '.site-nav__locations__region__places');

  /* 5 — contact band accordion (< 58.75rem) */
  var cform = document.querySelector('.contact-us-form__container');
  var cbtn = cform && cform.querySelector('.contact-us-form__accordion-button');
  if (cbtn) cbtn.addEventListener('click', function () {
    var on = !cform.classList.contains('active');
    cform.classList.toggle('active', on);
    cbtn.setAttribute('aria-expanded', String(on));
  });

  /* floating labels on selects keep their raised state once a value is chosen */
  Array.prototype.forEach.call(document.querySelectorAll('.mkto-form select'), function (s) {
    s.addEventListener('change', function () { s.classList.toggle('has-value', !!s.value); });
  });
})();
