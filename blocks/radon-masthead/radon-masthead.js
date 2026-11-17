/**
 * radon-masthead — plain left-aligned page title between two empty paragraph lines (source
 * div.radon-masthead on /es-es/casos: <p>&nbsp;</p><h1>&nbsp;Casos</h1><p>&nbsp;</p>; the
 * delivery pipeline drops the blank paragraphs, so their line boxes are CSS here).
 *
 * Authoring rows (defensive): every authored element, in order (normally the <h1>).
 *
 * Decode tier: template-slotted — authored nodes MOVED to the block root.
 */

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  if (nodes.length) block.replaceChildren(...nodes);
}
