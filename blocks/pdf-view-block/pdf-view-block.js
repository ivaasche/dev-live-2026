/**
 * pdf-view-block — inline PDF preview (source div.pdf-view-block, pdf.js viewer with the
 * toolbar off, main.css @303861–304943, prototype css/whitepaper.css).
 *
 * Authoring rows (defensive):
 *   - a link to the PDF (on the content bus, same origin — dynamic-features D5) — required
 *   - an optional heading (the source hgroup; empty on the whitepaper archetype)
 * The viewer loads pdf.js (pdfjs-dist, jsDelivr) once the block nears the viewport, lays out
 * every page at pdf.js "auto" zoom (min(fit width − 40px, fit height), pages 5px apart),
 * renders canvases lazily as pages scroll into the viewer, and adds the transparent text
 * layer. If the PDF cannot load, the authored link is shown instead.
 *
 * Decode tier: template-slotted — canon skeleton container > inner (hgroup) + viewer;
 * the authored heading and link are MOVED in (EW1); pages are runtime pdf.js output.
 * @ew-exempt page region labels ("Page n") are pdf.js's own landmark labels.
 */

const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build';

function div(className) {
  const el = document.createElement('div');
  if (className) el.className = className;
  return el;
}

// pdf.js link annotations (source .annotationLayer > section.linkAnnotation > a): one
// positioned anchor per Link annotation — internal destinations as `#<dest>` fragments,
// URI links opened in a new tab; the title is the page text under the link (as pdf.js)
async function renderLinks(page, box) {
  const annots = (await page.getAnnotations({ intent: 'display' }))
    .filter((a) => a.subtype === 'Link' && a.rect && (a.url || a.dest));
  if (!annots.length) return;
  const [vx0, vy0, vx1, vy1] = page.view;
  const pw = vx1 - vx0;
  const ph = vy1 - vy0;
  const { items } = await page.getTextContent();
  const layer = div('pdf-view-block-annotation-layer');
  annots.forEach((a) => {
    const [x0, x1] = [a.rect[0], a.rect[2]].sort((m, n) => m - n);
    const [y0, y1] = [a.rect[1], a.rect[3]].sort((m, n) => m - n);
    const section = document.createElement('section');
    section.className = 'pdf-view-block-link-annotation';
    section.style.left = `${((x0 - vx0) / pw) * 100}%`;
    section.style.top = `${((vy1 - y1) / ph) * 100}%`;
    section.style.width = `${((x1 - x0) / pw) * 100}%`;
    section.style.height = `${((y1 - y0) / ph) * 100}%`;
    const link = document.createElement('a');
    if (a.url) {
      link.href = a.url;
      link.target = '_blank';
      link.rel = 'noopener';
    } else {
      link.href = `#${encodeURIComponent(typeof a.dest === 'string' ? a.dest : JSON.stringify(a.dest))}`;
    }
    // glyphs (spread evenly over each text run) whose centre lies inside the link rect
    const words = items.map((t) => {
      const cy = t.transform[5] + t.height / 2;
      if (!t.str || cy < y0 || cy > y1) return '';
      const n = t.str.length;
      return [...t.str].filter((ch, i) => {
        const cx = t.transform[4] + (t.width * (i + 0.5)) / n;
        return cx >= x0 && cx <= x1;
      }).join('').trim();
    }).filter(Boolean);
    if (words.length) link.title = words.join(' ');
    section.append(link);
    layer.append(section);
  });
  box.append(layer);
}

async function renderPage(pdfjs, page, box) {
  const base = page.getViewport({ scale: 1 });
  const cssWidth = box.clientWidth || base.width;
  const scale = cssWidth / base.width;
  const ratio = window.devicePixelRatio || 1;
  const viewport = page.getViewport({ scale: scale * ratio });
  const canvas = document.createElement('canvas');
  canvas.className = 'pdf-view-block-canvas';
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.setAttribute('aria-hidden', 'true');
  await page.render({ canvasContext: canvas.getContext('2d'), viewport, canvas }).promise;
  box.prepend(canvas);
  const textLayer = div('pdf-view-block-text-layer');
  box.append(textLayer);
  const layer = new pdfjs.TextLayer({
    textContentSource: page.streamTextContent(),
    container: textLayer,
    viewport: base,
  });
  await layer.render();
  await renderLinks(page, box);
}

async function openViewer(block, viewer, list, href) {
  const pdfjs = await import(`${PDFJS}/pdf.min.mjs`);
  pdfjs.GlobalWorkerOptions.workerSrc = `${PDFJS}/pdf.worker.min.mjs`;
  const pdf = await pdfjs.getDocument({ url: href }).promise;
  const first = await pdf.getPage(1);
  const { width, height } = first.getViewport({ scale: 1 });
  block.style.setProperty('--page-ratio', `${width} / ${height}`);
  block.style.setProperty('--page-aspect', String(width / height));

  const pages = [];
  for (let n = 1; n <= pdf.numPages; n += 1) {
    const box = div(`page page-${n}`);
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', `Page ${n}`);
    box.dataset.page = String(n);
    pages.push(box);
  }
  list.append(...pages);
  viewer.classList.add('is-loaded');
  // pdf.js text layers size themselves in units of --total-scale-factor (CSS px per PDF unit)
  new ResizeObserver(() => {
    block.style.setProperty('--total-scale-factor', String(pages[0].clientWidth / width));
  }).observe(pages[0]);

  const draw = async (box) => {
    if (box.dataset.rendered) return;
    box.dataset.rendered = 'true';
    const page = await pdf.getPage(Number(box.dataset.page));
    await renderPage(pdfjs, page, box);
  };
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => {
      io.unobserve(e.target);
      draw(e.target);
    });
  }, { root: viewer.querySelector('.pdf-view-block-scroller'), rootMargin: '600px 0px' });
  pages.forEach((p) => io.observe(p));
  // pdf.js's rendering queue draws the visible page, then pre-renders the next one
  await draw(pages[0]);
  if (pages[1]) await draw(pages[1]);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .pdf-view-block-container')) return; // EW9 re-entrant

  const link = block.querySelector('a[href]');
  const headings = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6')];

  const container = div('pdf-view-block-container');
  const inner = div('pdf-view-block-inner');
  const hgroup = document.createElement('hgroup');
  hgroup.className = 'pdf-view-block-hgroup';
  hgroup.append(...headings);
  inner.append(hgroup);

  const viewer = div('pdf-view-block-viewer');
  const scroller = div('pdf-view-block-scroller');
  const list = div('pdf-view-block-pages');
  scroller.append(list);
  const fallback = div('pdf-view-block-fallback');
  if (link) fallback.append(link.closest('p') || link);
  viewer.append(scroller, fallback);
  container.append(inner, viewer);
  block.replaceChildren(container);
  if (!link) return;

  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    openViewer(block, viewer, list, link.href).catch((e) => {
      viewer.classList.add('is-failed');
      // eslint-disable-next-line no-console
      console.warn('pdf-view-block:', e.message);
    });
  }, { rootMargin: '1000px 0px' });
  io.observe(block);
}
