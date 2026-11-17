/**
 * author-details — article author byline(s) under the hero (source div.author-details,
 * one per author; main.css lifted in prototypes/css/article.css).
 *
 * Authoring rows (one row per author; cells classified by content, defensive):
 *   - paragraphs: [name], function, company — the source leaves its "name" line empty
 *     and prints the person in the "function" line, so 2 plain paragraphs = function +
 *     company (empty name slot), 3 = name + function + company, 1 = function
 *   - a paragraph holding a mailto link — the e-mail line
 *   - a picture — the thumbnail
 *   further plain paragraphs are kept, in order, after the company line.
 *
 * Decode tier: template-slotted — canon skeleton item > container > text + thumbnail,
 *   authored paragraphs and picture MOVED into their slots.
 */

function slot(className, node) {
  const div = document.createElement('div');
  div.className = className;
  if (node) div.append(node);
  return div;
}

function decorateRow(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  let picture = null;
  const lines = [];
  const emails = [];
  nodes.forEach((node) => {
    const pic = node.matches('picture') ? node : node.querySelector('picture, img');
    if (pic && !node.textContent.trim()) {
      picture = node.matches('picture, img') ? node : (node.querySelector('picture') || pic);
    } else if (node.querySelector('a[href^="mailto:"]')) {
      emails.push(node);
    } else if (node.textContent.trim() || node.matches('p')) {
      lines.push(node);
    }
  });

  const text = document.createElement('div');
  text.className = 'author-details-text';
  const named = lines.length >= 3;
  text.append(slot('author-details-name', named ? lines[0] : null));
  const rest = named ? lines.slice(1) : lines;
  if (rest[0]) text.append(slot('author-details-function', rest[0]));
  rest.slice(1).forEach((node) => text.append(slot('author-details-company', node)));
  emails.forEach((node) => text.append(slot('author-details-email', node)));

  const container = document.createElement('div');
  container.className = 'author-details-inner';
  container.append(text);
  if (picture) container.append(slot('author-details-thumbnail', picture));

  const item = document.createElement('div');
  item.className = 'author-details-item';
  item.append(container);
  return item;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .author-details-item')) return; // EW9 re-entrant
  const items = [...block.children].map(decorateRow);
  block.replaceChildren(...items);
}
