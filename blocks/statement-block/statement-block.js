/**
 * statement-block — a large standalone statement line (source section.statement-block.section >
 * .section__container.centralized > .statement-block__wrapper > [.statement-block__title] +
 * .statement-block__description > p.statement-block__description__text; main.css statement-block).
 *
 * Authoring rows (classified by content, defensive):
 *   - a heading       -> the optional slash title (source .statement-block__title)
 *   - any paragraph   -> the statement text (source p.statement-block__description__text)
 * Variants (block class): dark | blue — the source section theme; none = white (white-theme).
 *
 * Decode tier: template-slotted — canon skeleton container > wrapper > title + description;
 *   authored nodes MOVED in (EW1).
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .section-container')) return; // EW9
  const container = div('section-container centralized');
  const wrapper = div('statement-block-wrapper');
  const desc = div('statement-block-description');
  block.querySelectorAll(':scope > div > div > *').forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName)) {
      node.classList.add('statement-block-title');
      wrapper.append(node);
    } else if (node.textContent.trim()) {
      node.classList.add('statement-block-description-text');
      desc.append(node);
    }
  });
  wrapper.append(desc);
  container.append(wrapper);
  block.replaceChildren(container);
  if (block.classList.contains('dark')) block.classList.add('dark-theme');
  else if (block.classList.contains('blue')) block.classList.add('blue-theme');
  else block.classList.add('white-theme');
}
