/**
 * partners-block — partner logo strip (source div.partners-block): title, description and a
 * "See all partners" link, then a grid of linked partner logos (the partner name is kept as
 * visually hidden text).
 *
 * Authoring rows (classified by content, defensive):
 *   - the row with the heading — title (h2), description paragraph(s), a paragraph with the
 *     action link
 *   - every other row — one logo: a paragraph with a link whose text is `:partner-<name>:`
 *     (the logo icon, /icons/partner-<name>.svg) followed by the partner name
 *
 * @variants block class: homepage (home-page 4-up grid, source .homepage-partners-block) |
 *   dark (black band, source .dark-theme) | inline (offering strip, source
 *   .partners-block__section.inline: the heading alone above a 4-/5-up logo row) — combinable;
 *   default = the plain light strip
 * Decode tier: reconstructive (repeat group; canon partners-block skeleton, authored
 * heading / paragraphs / links MOVED in; the name text node is moved into the hidden span).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function logo(para) {
  const a = para.querySelector('a[href]');
  if (!a) return para;
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  para.classList.remove('button-wrapper');
  a.classList.add('partners-block-logo');
  const name = document.createElement('span');
  name.className = 'partners-block-logo-hidden-name';
  [...a.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    .forEach((n) => name.append(n));
  if (name.childNodes.length) a.append(name);
  return para;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .partners-block-container')) return; // EW9 re-entrant

  if (block.classList.contains('homepage')) block.classList.add('homepage-partners-block');
  if (block.classList.contains('dark')) block.classList.add('dark-theme');

  const rows = [...block.children];
  const headRow = rows.find((r) => r.querySelector('h1, h2, h3, h4, h5, h6'));
  const logoRows = rows.filter((r) => r !== headRow);

  const container = div('partners-block-container');
  const inline = block.classList.contains('inline');
  const section = div('partners-block-section');
  if (headRow && inline) {
    // inline: title only (source hgroup.partners-block__title inside the section)
    const nodes = [...headRow.querySelectorAll(':scope > div > *')];
    const hgroup = document.createElement('hgroup');
    hgroup.className = 'partners-block-title';
    hgroup.append(...nodes);
    section.append(hgroup);
  } else if (headRow) {
    const nodes = [...headRow.querySelectorAll(':scope > div > *')];
    const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
    const actionPara = nodes.find((n) => n !== heading && n.querySelector('a[href]'));
    const text = nodes.filter((n) => n !== heading && n !== actionPara);
    const content = div('partners-block-text-content');
    if (heading) content.append(div('partners-block-text-title', heading));
    if (text.length) content.append(div('partners-block-text-description', ...text));
    const head = div('partners-block-text', content);
    if (actionPara) {
      const a = actionPara.querySelector('a[href]');
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      actionPara.classList.remove('button-wrapper');
      head.append(div('partners-block-text-action', actionPara));
    }
    container.append(head);
  }
  const paras = logoRows.flatMap((r) => [...r.querySelectorAll(':scope > div > *')]);
  const list = div('partners-block-list', ...paras.map(logo));
  if (inline) section.classList.add('inline');
  section.append(list);
  container.append(section);
  block.replaceChildren(container);
}
