/* editorial archetype behaviours — only what fired on the live page
   (stardust/replica/motion/digital-media-performance-marketing.json):
   - .slide-fade-in image blocks get .played when scrolled into view (scroll reveal) */
(() => {
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
