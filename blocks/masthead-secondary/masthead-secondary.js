/**
 * masthead-secondary — full-viewport page masthead: an image filling the band and the page
 * title (underlined, white) over it, bottom-left (>= 58.75rem); image on top, title below on
 * small screens (source section.masthead-secondary[.masthead-scaler]; main.css
 * @masthead-secondary rules).
 *
 * Authoring rows (classified by content, defensive — any order, cells may be missing):
 *   - a picture                         -> the media panel
 *   - headings: the <h1> is the title; any other heading is a subtitle (source
 *     hgroup__subtitle, small uppercase line above the title)
 *   - key/value row `lines | <n>, <n>, …` (configuration) — the title's line breaks as word
 *     counts per line (the source title's newlines, white-space: pre-line >= 58.75rem; the
 *     delivery pipeline drops a <br> inside a heading): the title text is re-joined with
 *     newlines after those words
 *   - any other element (paragraphs)    -> the lead, in authored order
 * @variants light (default — white title over the image >= 58.75rem, source --light) | dark
 *   (black title, source --dark); scaler (source .masthead-scaler: overflow clipped, and
 *   from 58.75rem the image zooms 1 -> 1.25 as the masthead scrolls out of the viewport -
 *   the source's IntersectionObserver timeline, progress = 1 - intersection ratio)
 *
 * Decode tier: template-slotted — canon container > inner > wrap > text (hgroup + lead) +
 *   media skeleton; authored nodes MOVED into their slots (EW1).
 */

// source .masthead-scaler (common.js): an IntersectionObserver (thresholds 0..1 by .01) drives a
// scale 1 -> 1.25 timeline on the media while the masthead's top is above the viewport top;
// not on screens < 939px (the zoom is never reset at the top: the source rests zoomed there)
function scaler(block, target) {
  if (!target || window.matchMedia('(max-width: 58.6875rem)').matches) return;
  const threshold = Array.from({ length: 101 }, (_, i) => i / 100);
  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.intersectionRatio > 0 && e.boundingClientRect.top < e.rootBounds.top) {
        const r = Math.min(1, Math.max(0, e.intersectionRatio));
        target.style.transform = `scale(${1 + 0.25 * (1 - r)})`;
      }
    });
  }, { threshold }).observe(block);
}

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .masthead-secondary-container')) return; // EW9 re-entrant

  let lines = null;
  [...block.children].forEach((row) => {
    const [key, value] = [...row.children];
    if (value && key.textContent.trim().toLowerCase() === 'lines') {
      lines = value.textContent.split(/[^0-9]+/).filter(Boolean).map(Number);
      row.remove();
    }
  });
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const media = [];
  const headings = [];
  const lead = [];
  nodes.forEach((n) => {
    const pic = n.tagName === 'PICTURE' ? n : n.querySelector('picture');
    if (pic && !n.textContent.trim()) media.push(pic);
    else if (/^H[1-6]$/.test(n.tagName)) headings.push(n);
    else lead.push(n);
  });
  const title = headings.find((h) => h.tagName === 'H1') || headings[headings.length - 1];
  if (title && lines && !title.children.length) {
    const words = title.textContent.trim().split(/\s+/);
    const out = [];
    lines.forEach((n) => { if (words.length) out.push(words.splice(0, n).join(' ')); });
    if (words.length) out.push(words.join(' '));
    title.textContent = out.join('\n');
  }

  const container = div('masthead-secondary-container reveal-box');
  const inner = div('masthead-secondary-inner');
  const wrap = div('masthead-secondary-inner-wrap');
  const dark = block.classList.contains('dark');
  const text = div(`masthead-secondary-text masthead-secondary-text-${dark ? 'dark' : 'light'}`);
  if (headings.length) {
    const hgroup = document.createElement('hgroup');
    hgroup.className = 'masthead-secondary-hgroup';
    headings.forEach((h) => h.classList.add(h === title
      ? 'masthead-secondary-hgroup-title' : 'masthead-secondary-hgroup-subtitle'));
    hgroup.append(...headings.filter((h) => h !== title), title);
    text.append(hgroup);
  }
  if (lead.length) {
    const leadBox = div('masthead-secondary-lead');
    leadBox.append(...lead);
    text.append(leadBox);
  }
  wrap.append(text);
  const mediaBox = div('masthead-secondary-media');
  mediaBox.append(...media);
  wrap.append(mediaBox);
  inner.append(wrap);
  container.append(inner);
  block.replaceChildren(container);
  if (block.classList.contains('scaler')) scaler(block, media[0]?.querySelector('img'));
}
