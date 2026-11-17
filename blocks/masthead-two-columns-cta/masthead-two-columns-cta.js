/**
 * masthead-two-columns-cta — whitepaper hero (source section.masthead-two-columns-cta,
 * main.css @299254–303784, prototype css/whitepaper.css): text column (title, intro,
 * key figures, CTA) beside a full-height image; image first under 940px.
 *
 * Authoring rows (classified by content, defensive — cells may be added or omitted):
 *   - a heading (the page's <h1>) — the title
 *   - a two-cell text row `value | label` (e.g. `20 | Minutos de lectura`) — one key figure
 *   - a paragraph holding only links — the CTA (each link painted as the filled pill)
 *   - pictures, in order: >= 940px crop, >= 720px crop, < 720px crop (one is enough)
 *   - any other paragraph — the intro text
 *
 * @variants block class: right (offering — text left, image right >= 58.75rem; source
 *   __inner__wrap.right); default = image left
 * Decode tier: template-slotted — canon skeleton container > inner > wrap > text + media;
 * authored nodes MOVED into their slots (EW1); each figure cell's paragraph is MOVED into
 * the canon parameter box and laid out inline as the source value / label spans.
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function isLinkParagraph(el) {
  const links = [...el.querySelectorAll('a')];
  return links.length > 0
    && el.textContent.trim() === links.map((a) => a.textContent).join('').trim();
}

function figure(cells) {
  const box = div('masthead-two-columns-cta-parameter');
  ['value', 'label'].forEach((part, i) => {
    const cell = cells[i];
    if (!cell.children.length) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      cell.append(p);
    }
    [...cell.children].forEach((node) => {
      node.classList.add(`masthead-two-columns-cta-${part}`);
      box.append(node);
    });
  });
  return box;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .masthead-two-columns-cta-container')) return; // EW9

  const hgroup = document.createElement('hgroup');
  hgroup.className = 'masthead-two-columns-cta-hgroup';
  const intro = div('masthead-two-columns-cta-intro');
  const params = div('masthead-two-columns-cta-parameters');
  const cta = div('masthead-two-columns-cta-cta');
  const media = div('masthead-two-columns-cta-media');
  const pictures = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const plain = cells.every((c) => !c.querySelector('picture, img, a, h1, h2, h3, h4, h5, h6'));
    if (cells.length === 2 && plain && cells.every((c) => c.textContent.trim())) {
      params.append(figure(cells));
      return;
    }
    cells.forEach((cell) => {
      // bare text in a cell (single-paragraph cells) is wrapped as a paragraph
      if (!cell.children.length && cell.textContent.trim()) {
        const p = document.createElement('p');
        p.append(...cell.childNodes);
        cell.append(p);
      }
      [...cell.children].forEach((node) => {
        const pic = node.matches('picture') ? node : node.querySelector('picture');
        if (pic) {
          pictures.push(pic);
          if (node !== pic && !node.textContent.trim()) node.remove();
        } else if (/^H[1-6]$/.test(node.tagName)) {
          hgroup.append(node);
        } else if (node.tagName === 'P' && isLinkParagraph(node)) {
          node.querySelectorAll('a').forEach((a) => {
            a.classList.add('button', 'button-primary-hollow');
          });
          cta.append(node);
        } else {
          intro.append(node);
        }
      });
    });
  });

  const sizes = ['wide', 'mid', 'narrow'];
  pictures.forEach((pic, i) => {
    pic.classList.add(`masthead-two-columns-cta-${sizes[Math.min(i, 2)]}`);
    media.append(pic);
  });
  media.dataset.crops = String(Math.min(pictures.length, 3));

  const text = div('masthead-two-columns-cta-text');
  [hgroup, intro, params, cta].forEach((part) => {
    if (part.childNodes.length) text.append(part);
  });

  const wrap = div('masthead-two-columns-cta-inner-wrap');
  // the media panel is kept even when empty (source: an empty __media div still holds the
  // half-width, viewport-tall column — the image-less second masthead of a whitepaper)
  wrap.append(text, media);
  const inner = div('masthead-two-columns-cta-inner');
  inner.append(wrap);
  const container = div('masthead-two-columns-cta-container');
  container.append(inner);
  block.replaceChildren(container);
}
