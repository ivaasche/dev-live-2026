/**
 * masthead-quaternary — a full-width 16:9 video masthead; the title sits under the video on
 * small screens and is visually hidden over it from 58.75rem (source div.masthead-quaternary
 * > __container > __inner > __inner__wrap > __text (hgroup > h1) + __media > section.video-block
 * (poster image, consent stub, TwentyThree player iframe); main.css masthead-quaternary rules).
 *
 * Authoring rows (classified by content, defensive):
 *   - a heading — the title (h1)
 *   - key/value row `video | <player URL>` — the player (configuration; a bare player link
 *     paragraph is accepted too)
 *   - a picture — the poster shown under the player
 *   - a paragraph — the consent stub text (hidden, as the source with consent)
 * @variants dark — the source __text--dark (black title at every width); scaler — the source
 *   .masthead-scaler: overflow clipped and, from 58.75rem, the video zooms 1 -> 1.25 as the
 *   masthead scrolls out of the viewport (the source's IntersectionObserver timeline)
 * Decode tier: template-slotted — canon skeleton; authored heading, picture and stub MOVED in.
 * @ew-exempt the `video` key cell and the player URL are configuration (the player is its render)
 */

// source .masthead-scaler (common.js): IntersectionObserver (thresholds 0..1 by .01) -> scale
// 1 -> 1.25 on the media while the masthead's top is above the viewport top; not < 939px
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

function div(className, tag = 'div') {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .masthead-quaternary-container')) return; // already decorated
  let href = '';
  let source = null;
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const picture = block.querySelector('picture');
  const stub = [];
  [...block.children].forEach((row) => {
    const [key, value] = [...row.children];
    if (value && key.textContent.trim().toLowerCase() === 'video') {
      href = value.querySelector('a[href]')?.href || value.textContent.trim();
      source = row;
      return;
    }
    row.querySelectorAll('p').forEach((p) => {
      const a = p.querySelector('a[href]');
      if (!href && a && /videos\.|\/v\.ihtml\//.test(a.href) && p.textContent.trim() === a.textContent.trim()) {
        href = a.href;
        source = p;
      } else if (!p.querySelector('picture') && p.textContent.trim()) stub.push(p);
    });
  });

  const container = div('masthead-quaternary-container');
  const inner = div('masthead-quaternary-inner');
  const wrap = div('masthead-quaternary-inner-wrap');
  const text = div(`masthead-quaternary-text masthead-quaternary-text-${block.classList.contains('dark') ? 'dark' : 'light'}`);
  const hgroup = div('masthead-quaternary-hgroup', 'hgroup');
  if (heading) {
    heading.classList.add('masthead-quaternary-hgroup-title');
    hgroup.append(heading);
  }
  text.append(hgroup);
  const media = div('masthead-quaternary-media');
  const video = div('video-block masthead-quaternary-video-block video-toolbar', 'section');
  const vc = div('video-block-container');
  const vw = div('video-block-container-wrapper loop');
  if (picture) {
    picture.querySelector('img')?.classList.add('video-block-image', 'poster');
    vw.append(picture);
  }
  if (stub.length) {
    const box = div('video-block-stub-text hide');
    const span = document.createElement('span');
    span.append(...stub);
    box.append(span);
    vw.append(box);
  }
  if (href && /^https?:\/\//.test(href)) {
    const box = div('video-block-iframe');
    const iframe = document.createElement('iframe');
    iframe.src = href;
    iframe.title = heading ? heading.textContent.trim() : '';
    iframe.allow = 'autoplay';
    iframe.setAttribute('frameborder', '0');
    box.append(iframe);
    vw.append(box);
  }
  vc.append(vw);
  if (source) {
    source.hidden = true;
    vc.append(source);
  }
  video.append(vc);
  media.append(video);
  wrap.append(text, media);
  inner.append(wrap);
  container.append(inner);
  block.replaceChildren(container);
  if (block.classList.contains('scaler')) scaler(block, video);
}
