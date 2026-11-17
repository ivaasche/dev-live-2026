/**
 * table — a rich-text data table (source `.text-content table`, main.css @34479–34943),
 * e.g. the privacy policy's data-protection contacts.
 *
 * Authoring rows: one row per table row, one cell per column; the first row is the
 * header row (th scope=col). Cells may hold text, paragraphs, links, line breaks; an
 * empty cell stays an empty cell. Rows with fewer cells are kept as they are.
 *
 * @variants block class: no-header (every row is a body row — a one-cell rich-text table,
 *   e.g. the editorial Amazon panel), word, logos (CSS only)
 * Decode tier: template-slotted — table > thead/tbody, authored cell nodes MOVED (EW1).
 */

/**
 * A bold link alone in a cell paragraph is buttonized by scripts.js (strong > a); the source
 * renders table links as inline rich-text links, so restore the bold inline link.
 */
function unbutton(cell) {
  cell.querySelectorAll('a.button').forEach((a) => {
    const strong = a.classList.contains('primary') || a.classList.contains('accent');
    const em = a.classList.contains('secondary') || a.classList.contains('accent');
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
    a.querySelectorAll(':scope > .before, :scope > .after').forEach((s) => s.remove());
    a.closest('.button-wrapper')?.classList.remove('button-wrapper');
    let node = a;
    [[strong, 'strong'], [em, 'em']].forEach(([on, tag]) => {
      if (!on) return;
      const wrap = document.createElement(tag);
      node.replaceWith(wrap);
      wrap.append(node);
      node = wrap;
    });
  });
}

function moveCell(cell, tag) {
  unbutton(cell);
  const el = document.createElement(tag);
  if (tag === 'th') el.scope = 'col';
  el.append(...cell.childNodes);
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > table')) return; // EW9 re-entrant
  const rows = [...block.children];
  if (!rows.length) return;
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headed = !block.classList.contains('no-header');
  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    const head = headed && i === 0;
    [...row.children].forEach((cell) => tr.append(moveCell(cell, head ? 'th' : 'td')));
    (head ? thead : tbody).append(tr);
  });
  if (thead.children.length) table.append(thead);
  table.append(tbody);
  block.replaceChildren(table);
}
