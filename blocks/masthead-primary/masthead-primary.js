/**
 * masthead-primary — campaign masthead: text panel (title + lead) left, image right
 * (>= 58.75rem); image on top, text below on small screens.
 * Source module section.masthead-primary (main.css @50127–54466, prototype css/campaign.css).
 *
 * Authoring rows (classified by content, defensive — any order, cells may be missing):
 *   - a picture / image                 -> the media panel; a second picture is the small-screen
 *     (< 520px) crop, the first the wide one
 *   - a heading (the page's single <h1>) -> the title; when the row opens with several
 *     headings, the last is the title and the ones before it are subtitles (source
 *     hgroup__subtitle, small uppercase line above the title)
 *   - any other element (paragraphs)    -> the lead, in authored order
 * Variant classes: (none) / `dark` = dark text on a white panel (source --dark);
 *   `light` = white text on a black panel (source --light).
 *   `title-break` = the source title's trailing newlines (white-space: pre-line >= 58.75rem):
 *   one empty line box after the title (the delivery pipeline strips authored <br>s there).
 *
 * Decode tier: template-slotted — canon container > inner > wrap > text (hgroup + lead)
 * + media skeleton; authored nodes MOVED into their slots (EW1).
 */

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .masthead-primary-container')) return; // EW9 re-entrant

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const media = nodes.filter((n) => n.matches('picture, img')
    || (n.tagName === 'P' && n.querySelector('picture, img') && !n.textContent.trim()));
  // the leading run of headings: the last is the title, any before it are subtitles
  // (source hgroup__subtitle, painted above the title)
  const run = [];
  nodes.filter((n) => !media.includes(n)).every((n) => {
    if (!/^H[1-6]$/.test(n.tagName)) return false;
    run.push(n);
    return true;
  });
  const heading = run.length ? run[run.length - 1] : nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const subtitles = run.slice(0, -1);
  const lead = nodes.filter((n) => n !== heading && !subtitles.includes(n) && !media.includes(n));

  const light = block.classList.contains('light');
  const container = div('masthead-primary-container');
  const inner = div('masthead-primary-inner');
  const wrap = div('masthead-primary-wrap');
  const text = div(`masthead-primary-text masthead-primary-text-${light ? 'light' : 'dark'}`);

  if (heading) {
    const hgroup = document.createElement('hgroup');
    hgroup.className = 'masthead-primary-hgroup';
    subtitles.forEach((n) => n.classList.add('masthead-primary-hgroup-subtitle'));
    hgroup.append(...subtitles, heading);
    text.append(hgroup);
  }
  if (lead.length) {
    const leadBox = div('masthead-primary-lead');
    leadBox.append(...lead);
    text.append(leadBox);
  }
  wrap.append(text);

  if (media.length) {
    const mediaBox = div('masthead-primary-media');
    media.forEach((m, i) => {
      const picture = m.tagName === 'P' ? m.querySelector('picture') || m.querySelector('img') : m;
      // two pictures = art direction: the first from 520px, the second below (source <picture>
      // whose small-screen fallback <img> is another crop, e.g. /es-es/casos/lexus-europa)
      if (media.length > 1) picture.classList.add(i ? 'masthead-primary-narrow' : 'masthead-primary-wide');
      mediaBox.append(picture);
      if (m.tagName === 'P' && !m.children.length) m.remove();
    });
    wrap.append(mediaBox);
  }

  inner.append(wrap);
  container.append(inner);
  block.replaceChildren(container);
}
