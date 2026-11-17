/**
 * impact-block — a dark band of headline figures: a title on the left, figure cards in a
 * two-column grid on the right (>= 90rem); stacked below (source section.impact-block.section
 * .dark-theme > .section__container.impact-block__container.centralized > h2.impact-block__title
 * + .impact-block__items > .impact-block__item; main.css impact-block rules).
 *
 * Authoring rows (classified by content, defensive):
 *   - a single-cell row holding a heading       -> the title (h2.impact-block__title)
 *   - any other row: first cell = the figure, second cell = the description (one card each)
 * Variant `dark`: the source's dark-theme (black band, white text); `blue`: the source's
 * blue-theme (ocean band, white text).
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton container > title + items > item
 *   (data + description); authored nodes MOVED in (EW1).
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

// a cell's content as a paragraph: EDS unwraps a single-paragraph cell into bare inline content
function asParagraph(cell) {
  if (!cell) return null;
  const p = cell.querySelector(':scope > p');
  if (p) return p;
  if (!cell.textContent.trim()) return null;
  const np = document.createElement('p');
  np.append(...cell.childNodes);
  return np;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .impact-block-container')) return; // EW9 re-entrant
  const container = div('impact-block-container');
  const items = div('impact-block-items');
  let title = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading && !title && cells.length === 1) {
      heading.classList.add('impact-block-title');
      title = heading;
      return;
    }
    const data = asParagraph(cells[0]);
    const desc = asParagraph(cells[1]);
    if (!data && !desc) return;
    const item = div('impact-block-item');
    if (data) {
      const box = div('impact-block-item-data');
      data.classList.add('impact-block-item-data-point');
      box.append(data);
      item.append(box);
    }
    if (desc) {
      desc.classList.add('impact-block-item-description');
      item.append(desc);
    }
    items.append(item);
  });
  items.classList.add(`impact-block-items-count-${items.children.length}`);
  if (title) container.append(title);
  container.append(items);
  block.replaceChildren(container);
}
