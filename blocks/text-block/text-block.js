/**
 * text-block — centred italic intro paragraph(s) under a page masthead (source module
 * div.text-block; main.css @126654–127026). Used by the listing siblings /es-es/eventos and
 * /es-es/whitepapers.
 *
 * Authoring rows (defensive): every authored element of every cell, in order (normally one
 * paragraph).
 *
 * Decode tier: template-slotted — container > authored nodes MOVED in.
 */

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  if (!nodes.length) return;
  const container = document.createElement('div');
  container.className = 'text-block-inner';
  container.append(...nodes);
  block.replaceChildren(container);
}
