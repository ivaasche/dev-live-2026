/**
 * contact-form — the black "Contáctanos" contact band (source div.contact-us-form,
 * target of the side tab's #contact-us-form link): title + intro on the left, the
 * Marketo form on the right (>= 58.75rem); below 58.75rem a collapsed accordion.
 *
 * Authoring rows (classified by content, defensive):
 *   - a heading (h2) — the band title
 *   - paragraphs — the intro copy
 *   - key/value rows `form | <id>`, `munchkin | <id>`, `host | <host>` — the Marketo form
 *     reference; they are handed to a nested `marketo-form` block (loaded with loadBlock)
 *
 * Decode tier: template-slotted (canon .contact-us-form skeleton, authored nodes MOVED in).
 * @ew-exempt the accordion button label is an EW4 presentational clone of the title (EW7:
 *   a <button> never hosts the authored heading); the key/value rows are metadata.
 */

const CONFIG_KEYS = ['form', 'munchkin', 'host', 'formid', 'form-id', 'munchkin-id'];

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

const text = (el) => (el ? el.textContent.trim() : '');

function isConfigRow(row) {
  const cells = [...row.children];
  return cells.length === 2 && CONFIG_KEYS.includes(text(cells[0]).toLowerCase());
}

export default async function decorate(block) {
  if (block.querySelector('.contact-us-form-container')) return; // EW9 re-entrant

  const rows = [...block.children];
  const configRows = rows.filter(isConfigRow);
  const contentRows = rows.filter((r) => !configRows.includes(r));
  const nodes = contentRows.flatMap((r) => [...r.querySelectorAll(':scope > div > *')]);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const copy = nodes.filter((n) => n !== heading);

  block.classList.add('contact-us-form');
  block.id = 'contact-us-form';

  const container = document.createElement('div');
  container.className = 'contact-us-form-container js-accordion';

  const intro = document.createElement('div');
  intro.className = 'contact-us-form-column';
  if (heading) {
    const titleBox = document.createElement('div');
    titleBox.className = 'contact-us-form-heading';
    heading.id = 'contact-us-form-title';
    heading.tabIndex = -1;
    titleBox.append(heading);
    intro.append(titleBox);
  }

  const panelId = 'contact_us_container';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'contact-us-form-accordion-button';
  button.setAttribute('aria-controls', panelId);
  button.setAttribute('aria-expanded', 'false');
  if (heading) {
    const label = stripInstrumentation(heading.cloneNode(true));
    button.append(...label.childNodes, ' ');
  }
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '/icons/sprite.svg#icon-arrow-down');
  arrow.append(use);
  button.append(arrow);
  intro.append(button);

  const content = document.createElement('div');
  content.className = 'contact-us-form-content';
  content.append(...copy);
  intro.append(content);

  const formColumn = document.createElement('div');
  formColumn.id = panelId;
  formColumn.className = 'contact-us-form-column contact-us-form-accordion-column';

  container.append(intro, formColumn);
  block.replaceChildren(container);

  button.addEventListener('click', () => {
    const on = !container.classList.contains('active');
    container.classList.toggle('active', on);
    button.setAttribute('aria-expanded', String(on));
  });

  if (configRows.length) {
    const form = document.createElement('div');
    form.className = 'marketo-form';
    form.append(...configRows);
    formColumn.append(form);
    try {
      // the nested block goes through the regular EDS block loader (no cross-block import)
      const { decorateBlock, loadBlock } = await import('../../scripts/aem.js');
      decorateBlock(form);
      await loadBlock(form);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('contact-form: marketo-form not loaded', e);
    }
  }
}
