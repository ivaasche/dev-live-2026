/**
 * subscription-block — full-width coloured call-to-action band: a centred title and one pill
 * link (source section.subscription-block; main.css @400619–402710). Used by /es-es/casos.
 *
 * Authoring rows (classified by content, defensive — one cell or many):
 *   - a heading — the title
 *   - a paragraph holding a link — the CTA (the source's blue pill with white inset ring)
 *   - any other paragraph — kept after the title, in order
 * Block variants: dark | white | off-white (source theme classes).
 *
 * Decode tier: template-slotted — container > wrapper; authored nodes MOVED in.
 */

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const wrapper = document.createElement('div');
  wrapper.className = 'subscription-block-band';
  nodes.forEach((node) => {
    const link = node.querySelector('a[href]');
    if (/^H[1-6]$/.test(node.tagName)) node.classList.add('subscription-block-title');
    else if (link && node.textContent.trim() === link.textContent.trim()) {
      node.classList.add('subscription-block-action');
      link.classList.add('subscription-block-button');
    }
    wrapper.append(node);
  });
  const container = document.createElement('div');
  container.className = 'subscription-block-inner';
  container.append(wrapper);
  block.replaceChildren(container);
}
