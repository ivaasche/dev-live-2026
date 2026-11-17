/**
 * expandable-faq-block — FAQ band: a "/ tag" label, an optional title, an intro, a
 * "show more" toggle revealing a list of native <details> question/answer rows (source
 * section.expandable-faq-block.section.white-theme; prototypes/css/article.css).
 *
 * Authoring rows (classified by content, defensive):
 *   - an <h2> — the tag label (rendered "/ LABEL")
 *   - an <h3> (optional) — the title (the source slot stays empty when none is authored)
 *   - paragraphs before the first question — the intro
 *   - key/value row `button | <label>` — the toggle label (the label paragraph is MOVED
 *     into the toggle, which is a div[role=button] so the label stays editable — EW7)
 *   - one row per question: an <h4> question (first cell or leading element) and the
 *     answer (paragraphs/lists, same cell or second cell); a flattened single cell is
 *     segmented on the <h4> boundary.
 *
 * @variants block class: open (list visible at rest; default collapsed behind the toggle)
 * @ew-exempt the key cell `button` is metadata (never displayed)
 * Decode tier: reconstructive (repeat group) — canon skeleton inner > tag + content;
 *   every authored heading/paragraph MOVED into its slot; summary icons are generated.
 */

const SPRITE = () => `${window.hlx?.codeBasePath || ''}/icons/sprite.svg`;
const KEYS = ['button', 'toggle'];

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function icon(name, className) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', className);
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `${SPRITE()}#icon-${name}`);
  svg.append(use);
  return svg;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .expandable-faq-block-inner')) return; // EW9 re-entrant

  let tag = null;
  let title = null;
  let toggleLabel = [];
  const intro = [];
  const items = [];
  let current = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells.length === 2 ? cells[0].textContent.trim().toLowerCase() : '';
    if (KEYS.includes(key)) {
      toggleLabel = [...cells[1].children];
      if (!toggleLabel.length && cells[1].textContent.trim()) {
        const p = document.createElement('p'); // harness-only fallback: bare text cell
        p.append(...cells[1].childNodes);
        toggleLabel = [p];
      }
      return;
    }
    cells.flatMap((cell) => [...cell.children]).forEach((node) => {
      if (node.tagName === 'H4') {
        current = { question: node, answer: [] };
        items.push(current);
      } else if (current) {
        current.answer.push(node);
      } else if (node.tagName === 'H2' && !tag) {
        tag = node;
      } else if (node.tagName === 'H3' && !title) {
        title = node;
      } else {
        intro.push(node);
      }
    });
  });

  block.classList.add('white-theme');
  const inner = div('expandable-faq-block-inner');
  if (tag) inner.append(div('expandable-faq-block-tag', tag));

  const content = div('expandable-faq-block-content');
  content.append(div('expandable-faq-block-title', ...(title ? [title] : [])));
  if (intro.length) content.append(div('expandable-faq-block-description', ...intro));

  const list = document.createElement('ul');
  list.className = 'expandable-faq-block-list';
  list.id = `faq-list-${[...document.querySelectorAll('.expandable-faq-block')].indexOf(block)}`;
  items.forEach(({ question, answer }) => {
    const li = document.createElement('li');
    li.className = 'expandable-faq-block-item';
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.className = 'expandable-faq-block-toggle';
    summary.append(
      div(
        'expandable-faq-block-icons',
        icon('plus-thin', 'expandable-faq-block-icon-plus'),
        icon('minus-thin', 'expandable-faq-block-icon-minus'),
      ),
      div('expandable-faq-block-question', question),
    );
    details.append(summary, div('expandable-faq-block-answer', ...answer));
    li.append(details);
    list.append(li);
  });

  const open = block.classList.contains('open');
  if (toggleLabel.length && items.length) {
    const toggle = div('expandable-faq-block-button btn-white', ...toggleLabel);
    toggle.setAttribute('role', 'button');
    toggle.tabIndex = 0;
    toggle.setAttribute('aria-controls', list.id);
    toggle.setAttribute('aria-expanded', String(open));
    const flip = () => {
      const on = list.classList.toggle('is-visible');
      toggle.setAttribute('aria-expanded', String(on));
    };
    toggle.addEventListener('click', flip);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
    content.append(toggle);
  }
  if (open || !toggleLabel.length) list.classList.add('is-visible');
  if (items.length) content.append(list);

  inner.append(content);
  block.replaceChildren(inner);
}
