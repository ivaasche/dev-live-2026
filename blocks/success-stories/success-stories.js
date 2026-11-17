/**
 * success-stories — a black story slider: image left (2/3), story text right (1/3) with a
 * prev / count / next control; one story at a time, fading (source div.success-stories >
 * .success-stories__slider-container.fade-slider; main.css success-stories + fade-slider).
 *
 * Authoring rows (classified by shape, defensive):
 *   - a one-cell row holding only a heading -> the slider title (source
 *     h2.success-stories__title); without one an empty aria-hidden title box is kept — the source
 *     always renders its (often empty) h2, whose 2rem bottom margin spaces the slider
 *   - every other row is a story: picture cell | text cell (h5 title + paragraphs); a
 *     one-cell row is split into its picture and the rest
 *
 * Decode tier: reconstructive (repeat group) — canon skeleton container > slider-container >
 *   image-container > image-block* + control-text-part > text-part > description* + control;
 *   the authored picture / text nodes MOVED into each story (EW1).
 * @ew-exempt the prev/next buttons (fixed source aria labels) and the 01 / 02 counter are
 *   generated controls, no authored text.
 */

const ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="31.64" height="6" viewBox="0 0 31.64 6" aria-hidden="true">'
  + '<rect y="2.5" width="31" height="1" fill="currentColor"></rect>'
  + '<polyline points="29 0.5 31 3 29 5.5" fill="none" stroke="currentColor" stroke-linecap="round">'
  + '</polyline></svg>';

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

const pad = (n) => String(n).padStart(2, '0');

export default function decorate(block) {
  if (block.querySelector(':scope > .success-stories-container')) return; // EW9
  const container = el('div', 'success-stories-container');
  const slider = el('div', 'success-stories-slider-container fade-slider');
  const images = el('div', 'success-stories-slider-image-container fade-slider-images-container');
  const controlText = el('div', 'success-stories-slider-control-text-part');
  const texts = el('div', 'success-stories-slider-text-part fade-slider-description-container');
  const stories = [];

  [...block.children].forEach((row) => {
    const nodes = [...row.children].flatMap((c) => [...c.children]);
    if (!row.querySelector('picture') && nodes.length && nodes.every((n) => /^H[1-6]$/.test(n.tagName))) {
      nodes[0].classList.add('success-stories-title');
      container.append(nodes[0]);
      return;
    }
    const image = el('div', 'fade-slider-image-block');
    const part = el('div', 'success-stories-slider-image-part');
    const desc = el('div', 'fade-slider-description');
    nodes.forEach((n) => {
      const pic = n.tagName === 'PICTURE' ? n : n.querySelector('picture');
      if (pic && !n.textContent.trim()) part.append(pic);
      else desc.append(n);
    });
    image.append(part);
    images.append(image);
    texts.append(desc);
    stories.push([image, desc]);
  });

  const control = el('div', 'success-stories-slider-control-part fade-slider-control');
  const prev = el('button', 'success-stories-slider-control-button fade-slider-control-button');
  prev.type = 'button';
  prev.dataset.buttontype = 'prev';
  prev.setAttribute('aria-label', 'Previous story');
  prev.innerHTML = ARROW;
  const next = el('button', 'success-stories-slider-control-button fade-slider-control-button');
  next.type = 'button';
  next.dataset.buttontype = 'next';
  next.setAttribute('aria-label', 'Next story');
  next.innerHTML = ARROW;
  const count = el('div', 'success-stories-slider-control-count fade-slider-control-count');
  control.append(prev, count, next);

  let current = 0;
  const show = (i) => {
    current = Math.max(0, Math.min(stories.length - 1, i));
    stories.forEach(([image, desc], k) => {
      image.hidden = k !== current;
      desc.hidden = k !== current;
    });
    count.textContent = `${pad(current + 1)} / ${pad(stories.length)}`;
    count.setAttribute('aria-label', `${current + 1} stories out of ${stories.length}`);
    prev.classList.toggle('hide', current === 0);
    next.classList.toggle('hide', current === stories.length - 1);
  };
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));

  controlText.append(texts);
  if (stories.length > 1) controlText.append(control);
  slider.append(images, controlText);
  if (!container.querySelector('.success-stories-title')) {
    const title = el('div', 'success-stories-title');
    title.setAttribute('aria-hidden', 'true');
    container.append(title);
  }
  container.append(slider);
  block.replaceChildren(container);
  show(0);
}
