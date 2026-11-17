/**
 * iehub-masthead — the Intelligent Enterprise hub masthead (source section.section.iehub-masthead):
 * a full-viewport blue band with a cover background image, a centred h1, a description and a
 * white pill CTA.
 *
 * Authoring rows (classified by content, defensive):
 *   - a heading                         -> the title (source .iehub-masthead__title > h1)
 *   - a paragraph with a link           -> the CTA (source a.btn--black.iehub-masthead__cta)
 *   - any other text paragraph          -> the description (source p.iehub-masthead__description)
 *   - pictures: the first = the landscape / >= 940px rendition, the second = the portrait
 *     rendition shown below 940px in portrait (source <picture> sources)
 *
 * Decode tier: template-slotted — canon skeleton container (title, description, cta) + bg image;
 *   authored nodes MOVED in (EW1).
 */

function div(className, ...nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .iehub-masthead-container')) return; // EW9
  const container = div('iehub-masthead-container');
  const bg = div('iehub-masthead-bg-image');
  const title = div('iehub-masthead-title');
  let desc = null;
  let cta = null;
  const pictures = [...block.querySelectorAll('picture')];
  block.querySelectorAll(':scope > div > div > *').forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName)) title.append(node);
    else if (node.querySelector('a[href]') && !node.querySelector('picture')) {
      cta = node.querySelector('a[href]');
      cta.className = 'btn-black iehub-masthead-cta';
    } else if (node.tagName === 'P' && node.textContent.trim() && !node.querySelector('picture')) {
      desc = node;
      desc.className = 'iehub-masthead-description';
    }
  });
  pictures.forEach((pic, i) => {
    pic.classList.add(i ? 'iehub-masthead-portrait' : 'iehub-masthead-landscape');
    const img = pic.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
    }
    bg.append(pic);
  });
  container.append(title);
  if (desc) container.append(desc);
  if (cta) container.append(cta);
  block.replaceChildren(container, bg);
}
