/**
 * video-block — a 16:9 embedded video player (source section.video-block, TwentyThree
 * player at videos.valtech.com; main.css video-block rules).
 *
 * Authoring rows (defensive): key/value row `video | <player URL>` (configuration, plain
 *   text or a link —
 *   the source's data-embed-id; a bare link to the player URL anywhere is accepted too);
 *   the consent stub text (a paragraph, e.g. "Please accept
 *   marketing cookies to watch the video") goes into the source's hidden stub box (shown
 *   by the source only without marketing consent); anything else is kept after the player.
 *
 * @variants block classes: autoplay, automute, loop (player flags appended to the URL as
 *   the source does: autoPlay=1, autoMute=1, loop=1; showTray=1 always), toolbar (the
 *   source video-toolbar class — the player shows its own tray)
 * Decode tier: template-slotted — canon skeleton container > wrapper > stub + iframe box;
 *   the authored URL paragraph is kept (hidden) as the player's source, the stub paragraph
 *   MOVED into the stub box.
 * @ew-exempt the `video` key cell and the player URL are configuration (hidden; the player
 *   is its render)
 */

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|PICTURE|DIV|BLOCKQUOTE|TABLE|PRE|HR)$/;

// a cell's authored nodes: EDS unwraps a single-paragraph cell into bare inline content —
// that content is MOVED into a <p> so it keeps its paragraph role
function cellNodes(cell) {
  if ([...cell.children].some((n) => BLOCK_TAGS.test(n.tagName))) return [...cell.children];
  if (!cell.textContent.trim() && !cell.children.length) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  cell.append(p);
  return [p];
}

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .video-block-container')) return; // EW9 re-entrant

  // key/value row `video | <url>` (configuration); the row is kept, hidden, as the source
  let urlPara = null;
  [...block.children].forEach((row) => {
    const [key, value] = [...row.children];
    if (value && key.textContent.trim().toLowerCase() === 'video') {
      urlPara = row;
    }
  });
  const nodes = [...block.querySelectorAll(':scope > div > div')]
    .filter((cell) => !urlPara?.contains(cell)).flatMap((cell) => cellNodes(cell));
  if (!urlPara) {
    urlPara = nodes.find((n) => {
      const a = n.querySelector('a[href]');
      return a && /^https?:\/\//.test(a.textContent.trim()) && n.textContent.trim() === a.textContent.trim();
    });
  }
  const href = urlPara?.querySelector('a[href]')?.href
    || urlPara?.lastElementChild?.textContent.trim();
  const container = div('video-block-container');
  const wrapper = div('video-block-container-wrapper');
  container.append(wrapper);
  const stub = nodes.filter((n) => n !== urlPara && n.tagName === 'P' && !n.querySelector('picture'));
  if (stub.length) {
    const box = div('video-block-stub-text hide');
    const span = document.createElement('span');
    span.append(...stub);
    box.append(span);
    wrapper.append(box);
  }
  if (href && /^https?:\/\//.test(href)) {
    const url = new URL(href);
    const flags = { autoPlay: 'autoplay', autoMute: 'automute', loop: 'loop' };
    Object.entries(flags).forEach(([param, cls]) => {
      if (block.classList.contains(cls)) url.searchParams.set(param, '1');
    });
    url.searchParams.set('showTray', '1');
    const box = div('video-block-iframe');
    const iframe = document.createElement('iframe');
    iframe.src = url.href;
    iframe.title = '';
    iframe.allow = 'autoplay';
    iframe.setAttribute('frameborder', '0');
    box.append(iframe);
    wrapper.append(box);
    urlPara.hidden = true;
    urlPara.classList.add('video-block-source');
    container.append(urlPara);
  }
  const rest = nodes.filter((n) => n !== urlPara && !stub.includes(n));
  if (rest.length) container.append(...rest);
  if (block.classList.contains('toolbar')) block.classList.add('video-toolbar');
  block.replaceChildren(container);
}
