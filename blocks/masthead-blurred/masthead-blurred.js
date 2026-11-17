/**
 * masthead-blurred — article hero (source section.masthead-blurred, main.css lifted in
 * prototypes/css/article.css): a blurred full-bleed copy of the hero image carrying the
 * title, and the sharp image overlapping its lower edge with a blurred drop shadow.
 *
 * Authoring rows (classified by content, defensive — one cell or many):
 *   - a heading (the page's single <h1>) — the title
 *   - picture 1 — the hero image (wide crop, shown >= 940px; the only one if no picture 2)
 *   - picture 2 (optional) — the narrow crop, shown < 940px (source <source media>)
 *   any other authored element is kept, in order, after the title.
 *
 * @variants block class: dark-text (default light — white title on the blurred image)
 * Decode tier: template-slotted — canon skeleton container > bg-visual (text) + visual;
 *   authored heading and pictures MOVED in; the blurred background and the drop-shadow
 *   images are EW4 presentational clones of picture 1 (instrumentation stripped).
 */

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  el.removeAttribute('data-image-index');
  return el;
}

function decorativeClone(picture) {
  const clone = stripInstrumentation(picture.cloneNode(true));
  clone.querySelectorAll('img').forEach((img) => {
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
  });
  clone.setAttribute('aria-hidden', 'true');
  return clone;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .masthead-blurred-inner')) return; // EW9 re-entrant

  const cells = [...block.querySelectorAll(':scope > div > div')];
  const nodes = cells.flatMap((cell) => [...cell.children]);
  const pictures = [];
  const text = [];
  nodes.forEach((node) => {
    const pic = node.matches('picture') ? node : node.querySelector('picture');
    if (pic) {
      pictures.push(pic);
      // a <p> wrapper left with nothing but the picture is dropped
      if (node !== pic && !node.textContent.trim()) node.remove();
    } else {
      text.push(node);
    }
  });

  const inner = document.createElement('div');
  inner.className = 'masthead-blurred-inner';

  const bg = document.createElement('div');
  bg.className = 'masthead-blurred-bg-visual';
  if (pictures[0]) bg.append(decorativeClone(pictures[0]));

  const textBox = document.createElement('div');
  textBox.className = 'masthead-blurred-text';
  if (!block.classList.contains('dark-text')) textBox.classList.add('masthead-blurred-text-light');
  textBox.append(...text);
  bg.append(textBox);
  inner.append(bg);

  if (pictures.length) {
    const visual = document.createElement('div');
    visual.className = 'masthead-blurred-visual';
    pictures[0].classList.add('masthead-blurred-wide');
    visual.append(pictures[0]);
    if (pictures[1]) {
      pictures[1].classList.add('masthead-blurred-narrow');
      visual.append(pictures[1]);
      visual.classList.add('has-narrow');
    }
    const shadow = decorativeClone(pictures[0]);
    shadow.className = 'masthead-blurred-shadow';
    visual.append(shadow);
    inner.append(visual);
    // any further picture stays visible after the hero (never dropped)
    pictures.slice(2).forEach((pic) => inner.append(pic));
  }

  block.replaceChildren(inner);
}
