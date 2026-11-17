/**
 * image-block — a full-width editorial image inside an article (source div.image-block,
 * main.css lifted in prototypes/css/article.css), optionally revealed on scroll.
 *
 * Authoring rows (classified by content, defensive):
 *   - picture 1 — the landscape image (shown in a landscape viewport, or always when it
 *     is the only picture)
 *   - picture 2 (optional) — the portrait image, shown in a portrait viewport (the source
 *     art-directs with <source media="(orientation: portrait|landscape)">)
 *   further pictures and any caption paragraphs are kept, in order, after them.
 *
 * @variants block class: reveal (source .slide-fade-in — faded in once scrolled into view)
 * Decode tier: template-slotted — canon skeleton inner; authored pictures MOVED in.
 */

export default function decorate(block) {
  if (block.querySelector(':scope > .image-block-inner')) return; // EW9 re-entrant

  const inner = document.createElement('div');
  inner.className = 'image-block-inner';
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const pictures = [];
  nodes.forEach((node) => {
    const pic = node.matches('picture, img') ? node : node.querySelector('picture, img');
    if (pic && !node.textContent.trim()) {
      pictures.push(pic);
      inner.append(pic);
    } else {
      inner.append(node);
    }
  });
  if (pictures.length > 1) {
    pictures[0].classList.add('image-block-landscape');
    pictures[1].classList.add('image-block-portrait');
    inner.classList.add('has-portrait');
  }
  block.replaceChildren(inner);

  if (block.classList.contains('reveal')) {
    block.classList.add('slide-fade-in');
    if (!('IntersectionObserver' in window)) {
      block.classList.add('played');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('played');
        io.unobserve(entry.target);
      });
    });
    io.observe(block);
  }
}
