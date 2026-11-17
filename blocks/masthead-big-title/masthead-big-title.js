/**
 * masthead-big-title — centred page title band without media (legal / policy pages).
 * Source module section.masthead-big-title (main.css @77492–78071).
 *
 * Authoring rows (positional, defensive):
 *   1. the page title as a heading (the page's single <h1>)
 *   any other authored element (a lede paragraph, a second heading) is kept,
 *   in order, after the title inside the same text box.
 *
 * Decode tier: template-slotted — container > text box, the authored heading MOVED in.
 */

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  if (!nodes.length) return;

  const container = document.createElement('div');
  container.className = 'masthead-big-title-inner';
  const text = document.createElement('div');
  text.className = 'masthead-big-title-text';
  container.append(text);

  // EW1: move every authored node (heading first by authored order)
  nodes.forEach((node) => text.append(node));
  block.replaceChildren(container);
}
