/**
 * registration-form — the hub pages' "book an executive session" band (source
 * section.registration-form, white): a centred title and a Marketo form (the existing
 * marketo-form block, nested and loaded through the EDS block loader), plus the source
 * thank-you popup (div.thank-you-popup) that opens when the form submits successfully.
 *
 * Authoring rows (classified by content, defensive):
 *   - the first row holding a heading — the band title
 *   - key/value rows (form | 10078, munchkin | …, host | …) — handed to marketo-form
 *     (@ew-exempt metadata, never displayed); `anchor | register-form` = id of the band
 *     (in-page #register-form CTAs land on it)
 *   - a later row holding a heading — the thank-you popup: cell 1 heading + paragraphs,
 *     cell 2 the close button label
 *
 * Decode tier: template-slotted (canon container > header > title + form column; popup
 * overlay > dialog skeleton); authored heading / paragraphs MOVED in (EW1).
 * @ew-exempt the popup's close icon button carries no authored text.
 */

function el(tag, className, ...nodes) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...nodes);
  return node;
}

function popup(row, block) {
  const cells = [...row.children];
  const textCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6')) || cells[0];
  const nodes = [...textCell.children];
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const desc = nodes.filter((n) => n !== heading);
  const labelCell = cells.find((c) => c !== textCell);

  const dialog = el('div', 'thank-you-popup-dialog');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  if (heading) {
    heading.classList.add('thank-you-popup-header');
    heading.id = `${block.id || 'registration'}-thank-you-title`;
    dialog.setAttribute('aria-labelledby', heading.id);
    dialog.append(heading);
  }
  const close = el('button', 'thank-you-popup-close-button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML = '<svg aria-hidden="true"><use href="/icons/sprite.svg#icon-close"></use></svg>';
  dialog.append(close);
  if (desc.length) dialog.append(el('div', 'thank-you-popup-description', ...desc));
  const back = el('button', 'thank-you-popup-button btn-black');
  back.type = 'button';
  if (labelCell) {
    const p = labelCell.querySelector('p') || labelCell;
    back.append(...p.childNodes);
    dialog.append(back);
  }
  const overlay = el('div', 'thank-you-popup-overlay');
  const wrap = el('div', 'thank-you-popup', overlay, dialog);
  const hide = () => wrap.classList.remove('is-open');
  [overlay, close, back].forEach((n) => n.addEventListener('click', hide));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrap.classList.contains('is-open')) hide();
  });
  return wrap;
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .registration-form-container')) return; // EW9 re-entrant
  block.classList.add('white-theme');

  const rows = [...block.children];
  const isConfig = (r) => r.children.length === 2
    && !r.querySelector('h1, h2, h3, h4, h5, h6, picture')
    && /^[a-z][\w-]*$/i.test(r.children[0].textContent.trim());
  const configRows = rows.filter(isConfig);
  const headingRows = rows.filter((r) => !isConfig(r) && r.querySelector('h1, h2, h3, h4, h5, h6'));
  const titleRow = headingRows[0];
  const popupRow = headingRows[1];

  const anchorRow = configRows.find((r) => r.children[0].textContent.trim().toLowerCase() === 'anchor');
  const formRows = configRows.filter((r) => r !== anchorRow);
  const anchor = anchorRow ? anchorRow.children[1].textContent.trim() : '';
  if (/^[A-Za-z][\w-]*$/.test(anchor)) block.id = anchor;

  const title = el('div', 'registration-form-title');
  if (titleRow) title.append(...titleRow.querySelectorAll(':scope > div > *'));
  const container = el('div', 'registration-form-container', el('div', 'registration-form-header', title));
  const formCol = el('div', 'registration-form-form');
  container.append(formCol);
  const thanks = popupRow ? popup(popupRow, block) : null;
  block.replaceChildren(container);
  if (thanks) block.append(thanks);

  if (!formRows.length) return;
  const form = el('div', 'marketo-form', ...formRows);
  formCol.append(form);
  if (thanks) {
    form.addEventListener('marketo-form:success', () => thanks.classList.add('is-open'));
  }
  try {
    // the nested block goes through the regular EDS block loader (no cross-block import)
    const { decorateBlock, loadBlock } = await import('../../scripts/aem.js');
    decorateBlock(form);
    await loadBlock(form);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('registration-form: marketo-form not loaded', e);
  }
}
