/* valtech.com replica — campaign archetype behaviour.
   results-statistics-block < 64rem: the source mounts flickity (cellAlign left, no wrap):
   one card per step, prev/next squares + line dots; ≥ 64rem it is a static 4-column grid. */
(function () {
  var mq = window.matchMedia('(min-width: 64rem)');
  Array.prototype.forEach.call(document.querySelectorAll('.results-statistics-block_container'), function (box) {
    var track = box.querySelector('.results-statistics-block_track');
    var items = box.querySelectorAll('.results-statistics-block_item');
    var dots = box.querySelectorAll('.results-statistics-block_dots .dot');
    var prev = box.querySelector('.carousel-btn--prev');
    var next = box.querySelector('.carousel-btn--next');
    var index = 0;
    function go(i) {
      index = Math.max(0, Math.min(items.length - 1, i));
      var x = mq.matches ? 0 : items[index].offsetLeft - items[0].offsetLeft;
      track.style.transform = x ? 'translateX(' + (-x) + 'px)' : '';
      Array.prototype.forEach.call(items, function (it, n) { it.classList.toggle('is-selected', n === index); });
      Array.prototype.forEach.call(dots, function (d, n) {
        d.classList.toggle('is-selected', n === index);
        if (n === index) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      if (prev) prev.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');
      if (next) next.setAttribute('aria-disabled', index === items.length - 1 ? 'true' : 'false');
    }
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
    mq.addEventListener('change', function () { go(index); });
  });
}());
