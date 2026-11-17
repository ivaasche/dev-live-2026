/**
 * cookie-declaration — the cookie policy's consent declaration (source div.cookie-manager
 * holding the Cookiebot CookieDeclaration, main.css @230103–231815 + Cookiebot's own rules).
 * Rendered from authored rows: Cookiebot (consent) is off on this site (martech D1), so the
 * declaration is a static snapshot of the live one.
 *
 * Authoring rows (classified by shape, defensive):
 *   - one-cell rows before the first category: lead rows — the first is the intro
 *     paragraph(s); when there are 3+, the middle ones are the consent-status line(s) and the
 *     last is the "last updated" line; with 2, the second is "last updated"
 *   - a one-cell row followed by a multi-cell row: a cookie category (bold name paragraph +
 *     description paragraph)
 *   - multi-cell rows: that category's table — the first is the header row (th), the rest
 *     one row per cookie (name | provider | purpose | expiry | type)
 *   - one-cell rows after the last table: the trailing action — its paragraph text becomes the
 *     centred tertiary consent-reset <button> (source button.cookiebot-reset; calls
 *     Cookiebot.renew() when the CMP is loaded)
 *
 * Decode tier: reconstructive (segment on the one-cell row that opens a table); every authored
 *   node MOVED (EW1), wrappers carry the source class names.
 */

const COL_WIDTHS = ['20%', '20%', '35%', '15%', '10%'];

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function moveChildren(from, to) {
  to.append(...from.childNodes);
  return to;
}

function buildTable(rows) {
  const table = document.createElement('table');
  table.className = 'cookie-declaration-table';
  const colgroup = document.createElement('colgroup');
  const width = rows[0] ? rows[0].children.length : 0;
  for (let i = 0; i < width; i += 1) {
    const col = document.createElement('col');
    if (width === COL_WIDTHS.length) col.style.width = COL_WIDTHS[i];
    colgroup.append(col);
  }
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const el = document.createElement(i === 0 ? 'th' : 'td');
      if (i === 0) el.scope = 'col';
      el.className = i === 0 ? 'cookie-declaration-table-header' : 'cookie-declaration-table-cell';
      tr.append(moveChildren(cell, el));
    });
    (i === 0 ? thead : tbody).append(tr);
  });
  table.append(colgroup, thead, tbody);
  return table;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .cookie-declaration-inner')) return; // EW9 re-entrant
  const rows = [...block.children];
  const multi = (row) => row && row.children.length > 1;

  const inner = div('cookie-declaration-inner');
  const declaration = div('cookie-declaration-body');
  inner.append(declaration);

  const lead = [];
  const groups = [];
  const trailing = [];
  rows.forEach((row, i) => {
    if (multi(row)) {
      if (groups.length) groups[groups.length - 1].rows.push(row);
    } else if (multi(rows[i + 1])) {
      groups.push({ head: row, rows: [] });
    } else if (groups.length) {
      trailing.push(row);
    } else {
      lead.push(row);
    }
  });

  lead.forEach((row, i) => {
    const cell = row.firstElementChild || row;
    let className = 'cookie-declaration-intro';
    if (i > 0 && i === lead.length - 1) className = 'cookie-declaration-last-updated';
    else if (i > 0) className = 'cookie-declaration-status';
    declaration.append(moveChildren(cell, div(className)));
  });

  groups.forEach(({ head, rows: tableRows }) => {
    const type = div('cookie-declaration-type');
    const cell = head.firstElementChild || head;
    const paras = [...cell.children];
    if (paras[0]) paras[0].classList.add('cookie-declaration-type-header');
    paras.slice(1).forEach((p) => p.classList.add('cookie-declaration-type-description'));
    moveChildren(cell, type);
    if (tableRows.length) type.append(buildTable(tableRows));
    declaration.append(type);
  });

  trailing.forEach((row) => {
    const action = div('cookie-declaration-action');
    const cell = row.firstElementChild || row;
    const source = cell.querySelector('p') || cell;
    const label = source.textContent.trim();
    if (!label) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-tertiary cookiebot-reset';
    // EW1: the authored paragraph itself moves into the button (an authored link, if any,
    // is unwrapped — the source control is a button, not a link)
    source.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
    button.append(source === cell ? moveChildren(cell, document.createElement('span')) : source);
    const before = document.createElement('span');
    before.className = 'before';
    before.setAttribute('aria-hidden', 'true');
    before.dataset.label = label;
    const after = document.createElement('span');
    after.className = 'after';
    after.setAttribute('aria-hidden', 'true');
    button.append(before, after);
    button.addEventListener('click', () => {
      if (window.Cookiebot && typeof window.Cookiebot.renew === 'function') window.Cookiebot.renew();
    });
    action.append(button);
    inner.append(action);
  });

  block.replaceChildren(inner);
}
