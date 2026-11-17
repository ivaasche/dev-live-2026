/**
 * highlighted-cta-block — full-width coloured call-to-action band: a large title, a short
 * description and one link (source section.highlighted-cta-block.section.blue-theme;
 * main.css @497378–498151, prototypes/css/article.css).
 *
 * Authoring rows (classified by content, defensive — one cell or many):
 *   - a heading (<h2>) — the title
 *   - paragraphs without a link — the description
 *   - a paragraph holding a link — the CTA (plain link → the source's ocean outline pill;
 *     authored bold/italic links keep the EDS .button styling)
 *
 * @variants block class: white (default blue — the source blue-theme band)
 * Decode tier: template-slotted — canon skeleton inner > title + details; authored nodes
 *   MOVED in; the CTA anchor gets the canon btn-ocean class (EW3 — edit mode repaints it
 *   from the `.highlighted-cta-block-details a` rule as well).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .highlighted-cta-block-inner')) return; // EW9 re-entrant
  if (!block.classList.contains('white')) block.classList.add('blue-theme');
  else block.classList.add('white-theme');

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const details = nodes.filter((n) => n !== heading);

  const inner = div('highlighted-cta-block-inner');
  if (heading) inner.append(div('highlighted-cta-block-title', heading));
  const box = div('highlighted-cta-block-details');
  details.forEach((node) => {
    const link = node.querySelector('a[href]');
    if (link && node.textContent.trim() === link.textContent.trim()) {
      node.classList.add('highlighted-cta-block-action');
      if (!link.classList.contains('button')) link.classList.add('btn-ocean');
    }
    box.append(node);
  });
  inner.append(box);
  block.replaceChildren(inner);
}
