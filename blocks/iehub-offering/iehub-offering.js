/**
 * iehub-offering — the hub's four-layer switcher (source section.section.iehub-offering
 * .js-iehub-offering.blue-theme): a row of pill tabs on a rule, a framed slide track (one
 * illustration per layer) and, under it, the active layer's description and a white pill CTA.
 *
 * Authoring rows: one per layer — cell 1 = the tab label; cell 2 = the illustration icon
 * (`:iehub-offering-<layer>:`, the source's inline Keyshape svg, first frame), a heading (the
 * description, source h3.iehub-offering__description) and a paragraph link (the CTA).
 *
 * Behaviour (source iehub-offering.js contract): a tab click shows its slide (--active-slide
 * translate) and marks its label active; the first layer is active on load.
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton pagination + track + slides;
 *   authored label / icon / heading / link MOVED into each slide (EW1).
 */

function el(tag, className, ...nodes) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...nodes);
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .section-container')) return; // EW9
  const pagination = el('div', 'iehub-offering-pagination');
  const slides = el('div', 'iehub-offering-slides');
  const texts = [];
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const [labelCell, bodyCell] = row.querySelectorAll(':scope > div');
    if (!labelCell) return;
    const name = el('span', 'iehub-offering-tab-name', labelCell.textContent.trim());
    const tab = el('button', 'iehub-offering-tab', name);
    tab.type = 'button';
    pagination.append(tab);
    const slide = el('div', 'iehub-offering-slide');
    const text = el('div', 'iehub-offering-text');
    if (bodyCell) {
      const icon = bodyCell.querySelector('.icon');
      if (icon) {
        const img = icon.querySelector('img');
        if (img) {
          img.loading = 'eager';
          img.width = 1920;
          img.height = 1080;
        }
        slide.append(icon);
      }
      const h = bodyCell.querySelector('h1, h2, h3, h4, h5, h6');
      if (h) {
        h.classList.add('iehub-offering-description');
        text.append(h);
      }
      const a = bodyCell.querySelector('a[href]');
      if (a) {
        a.className = 'btn-white iehub-offering-cta';
        text.append(el('div', 'iehub-offering-btn-wrapper', a));
      }
    }
    slide.append(text);
    slides.append(slide);
    texts.push(slide);
  });
  const rect = el('div', 'iehub-offering-slides-rectangle', slides);
  const wrapper = el('div', 'iehub-offering-wrapper', rect);
  const container = el('div', 'section-container iehub-offering-container centralized', pagination, wrapper);
  block.replaceChildren(container);
  block.classList.add('blue-theme'); // source section .blue-theme (band joins)

  const tabs = [...pagination.children];
  const activate = (i) => {
    slides.style.setProperty('--active-slide', i);
    tabs.forEach((t, j) => {
      t.querySelector('.iehub-offering-tab-name').classList.toggle('iehub-offering-tab-name-active', i === j);
      t.setAttribute('aria-selected', i === j ? 'true' : 'false');
    });
    texts.forEach((s, j) => s.setAttribute('aria-hidden', i === j ? 'false' : 'true'));
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => activate(i)));
  activate(0);
}
