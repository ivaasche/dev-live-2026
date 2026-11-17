/* article archetype behaviours — only what fired on the live page
   (stardust/replica/motion/es-es-blog-la-era-de-los-agentes-de-ia.json):
   - FAQ "Ver más" toggles .is-visible on the question list (rows are native <details>)
   - .slide-fade-in blocks get .played when scrolled into view (scroll reveal) */
(() => {
  document.querySelectorAll('.expandable-faq-block').forEach((block) => {
    const button = block.querySelector('.expandable-faq-block__content-wrapper__button');
    const list = block.querySelector('.expandable-faq-block__list');
    if (!button || !list) return;
    button.addEventListener('click', () => list.classList.toggle('is-visible'));
  });

  const reveal = document.querySelectorAll('.slide-fade-in');
  if (!('IntersectionObserver' in window)) {
    reveal.forEach((el) => el.classList.add('played'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('played');
      io.unobserve(entry.target);
    });
  });
  reveal.forEach((el) => io.observe(el));
})();
