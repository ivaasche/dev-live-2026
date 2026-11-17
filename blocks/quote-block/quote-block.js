/**
 * quote-block — the home page's black headline band (source section.quote-block): one large
 * display line, authored as the page <h1>.
 *
 * Authoring: one cell with the heading (any authored element is kept, in order).
 * Decode tier: template-slotted (canon .quote-block__container; authored nodes MOVED in).
 */

export default function decorate(block) {
  if (block.querySelector(':scope > .quote-block-container')) return; // EW9 re-entrant

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  // source structure <h1><span>…</span></h1>: the authored text moves into an inline span
  nodes.filter((n) => /^H[1-6]$/.test(n.tagName) && !n.querySelector('span')).forEach((h) => {
    const span = document.createElement('span');
    span.append(...h.childNodes);
    h.append(span);
  });
  const container = document.createElement('div');
  container.className = 'quote-block-container';
  container.append(...nodes);
  block.replaceChildren(container);
}
