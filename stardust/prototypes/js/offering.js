/* valtech.com replica — offering archetype behaviours.
   Related-content teaser slider: below 58.75rem the live page turns .teaser-block__container into a
   Flickity slider (viewport + slider inset 1.5rem, 270px cells 20px apart, 4-segment dots bar,
   hidden library prev/next + custom arrow prev/next; cells/dots get .is-selected). At >= 58.75rem it
   stays a flex row. */
(() => {
  const mq = window.matchMedia('(max-width: 58.749rem)');
  const NS = 'http://www.w3.org/2000/svg';
  const nativeBtn = (dir) => {
    const b = document.createElement('button');
    b.className = `carousel-native carousel-native--${dir}`;
    b.type = 'button';
    b.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'carousel-native__icon');
    svg.setAttribute('viewBox', '0 0 100 100');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z');
    if (dir === 'next') p.setAttribute('transform', 'translate(100, 100) rotate(180) ');
    svg.append(p);
    b.append(svg);
    return b;
  };

  document.querySelectorAll('.teaser-block__container').forEach((box) => {
    const cells = [...box.querySelectorAll(':scope > .teaser-block__teaser')];
    let built = null;
    let index = 0;

    const update = () => {
      const { slider, dots, prev, next, status } = built;
      const step = cells[1] ? cells[1].offsetLeft - cells[0].offsetLeft : 0;
      slider.style.transform = `translateX(${-index * step}px)`;
      cells.forEach((c, i) => c.classList.toggle('is-selected', i === index));
      [...dots.children].forEach((li, i) => {
        li.classList.toggle('is-selected', i === index);
        if (i === index) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      prev.setAttribute('aria-disabled', String(index === 0));
      next.setAttribute('aria-disabled', String(index === cells.length - 1));
      status.textContent = index ? `Slide ${index + 1} of ${cells.length}` : '';
    };
    const go = (i) => { index = Math.max(0, Math.min(cells.length - 1, i)); update(); };

    const build = () => {
      const status = document.createElement('span');
      status.className = 'dots-status visually-hidden';
      status.setAttribute('role', 'status');
      const viewport = document.createElement('div');
      viewport.className = 'flickity-viewport';
      const slider = document.createElement('div');
      slider.className = 'flickity-slider';
      slider.append(...cells);
      viewport.append(slider);
      const dots = document.createElement('ol');
      dots.className = 'flickity-page-dots';
      cells.forEach((_, i) => {
        const li = document.createElement('li');
        li.className = 'dot';
        li.setAttribute('aria-label', `Slide ${i + 1}`);
        li.addEventListener('click', () => go(i));
        dots.append(li);
      });
      const mk = (dir) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `carousel-btn carousel-btn--${dir}`;
        b.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
        b.addEventListener('click', () => go(index + (dir === 'prev' ? -1 : 1)));
        return b;
      };
      const prev = mk('prev');
      const next = mk('next');
      box.classList.add('flickity-enabled');
      box.append(status, viewport, nativeBtn('prev'), nativeBtn('next'), dots, prev, next);
      built = { status, viewport, slider, dots, prev, next };
      update();
    };
    const unbuild = () => {
      cells.forEach((c) => c.classList.remove('is-selected'));
      box.replaceChildren(...cells);
      box.classList.remove('flickity-enabled');
      built = null;
      index = 0;
    };
    const sync = () => { if (mq.matches && !built) build(); else if (!mq.matches && built) unbuild(); };
    sync();
    mq.addEventListener('change', sync);
  });

  /* .slide-fade-in blocks get .played when scrolled into view (observed: teaser header) */
  const reveal = document.querySelectorAll('.slide-fade-in');
  if (!('IntersectionObserver' in window)) { reveal.forEach((el) => el.classList.add('played')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('played');
      io.unobserve(entry.target);
    });
  });
  reveal.forEach((el) => io.observe(el));
})();
