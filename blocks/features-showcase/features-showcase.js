/**
 * features-showcase — a titled grid of icon + title + description items (source
 * section.features-showcase; main.css lifted in prototypes/css/article.css / offering.css).
 *
 * Authoring rows (classified by content, defensive):
 *   - leading rows without an item heading — the section head (an <h2> title, optional
 *     paragraphs)
 *   - one row per item: an icon (`:icon-name:` → span.icon, or a picture/img), the item
 *     heading (<h3>) and its description paragraphs (one cell or several). A flattened
 *     single cell holding several <h3> is segmented on the <h3> boundary.
 *
 * @variants block class: dark (source dark-theme — white on black; the source paints the
 *   module black in every use, the class is kept for parity with the source markup)
 *   | plain-text (offering: description paragraphs stay block boxes — the source has no
 *   inline <span> there)
 * Decode tier: reconstructive (repeat group) — canon skeleton inner > header + body > list;
 *   authored heading/paragraphs/icons MOVED into the slots.
 */

const ITEM_HEADING = 'h3, h4';

function isIcon(node) {
  return node.matches('span.icon, picture, img')
    || (!!node.querySelector('span.icon, picture, img') && !node.textContent.trim())
    || /^\s*:[a-z0-9-]+:\s*$/.test(node.textContent);
}

// the source wraps each description paragraph's text in an inline <span> (DA drops it):
// MOVE the authored child nodes into one so the text box shrinks to its lines like the source
function wrapInline(node) {
  if (!node.matches('p') || !node.childNodes.length) return;
  const only = node.children.length === 1 && node.firstElementChild;
  if (only && only.tagName === 'SPAN' && !node.textContent.replace(only.textContent, '').trim()) return;
  const span = document.createElement('span');
  span.append(...node.childNodes);
  node.append(span);
}

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .features-showcase-inner')) return; // EW9 re-entrant
  if (block.classList.contains('dark')) block.classList.add('dark-theme');
  // plain-text: the source description is a bare <p> (offering), not <p><span> (article)
  const plainText = block.classList.contains('plain-text');

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const head = [];
  const items = [];
  let current = null;
  let pendingIcon = [];
  nodes.forEach((node) => {
    if (node.matches(ITEM_HEADING)) {
      current = { icon: pendingIcon, title: node, body: [] };
      pendingIcon = [];
      items.push(current);
    } else if (isIcon(node)) {
      pendingIcon.push(node); // the icon precedes its item heading
    } else if (current) {
      current.body.push(node);
    } else {
      head.push(node);
    }
  });
  // a trailing icon with no heading after it stays visible in the last item
  if (pendingIcon.length && current) current.body.push(...pendingIcon);

  const inner = div('features-showcase-inner');
  if (head.length) inner.append(div('features-showcase-header', ...head));

  const list = document.createElement('ul');
  list.className = 'features-showcase-list';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'features-showcase-item';
    if (item.icon.length) li.append(div('features-showcase-item-icon', ...item.icon));
    li.append(div('features-showcase-item-title', item.title));
    if (!plainText) item.body.forEach(wrapInline);
    // a blank line authored as a zero-width-space / nbsp paragraph is a source spacer line
    // (an editor's empty <div>&nbsp;</div> in the description, in the description font)
    item.body.forEach((n) => {
      if (n.tagName === 'P' && !n.querySelector('img, picture, a')
        && !n.textContent.replace(/[\s\u200b\u00a0]/g, '')) n.classList.add('features-showcase-item-spacer');
    });
    if (item.body.length) li.append(div('features-showcase-item-description', ...item.body));
    list.append(li);
  });
  inner.append(div('features-showcase-body', list));

  block.replaceChildren(inner);
}
