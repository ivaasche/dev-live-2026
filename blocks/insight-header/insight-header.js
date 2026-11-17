/**
 * insight-header — featured insights masthead of a listing page (source section.insight-header,
 * main.css masthead-insights + u-grid): one full-width primary post, then two half-width
 * secondary posts.
 *
 * Authoring rows (defensive, queried — never hard-indexed):
 *   - a row holding an <h1> and no link: the page title, kept for crawlers and screen readers
 *     (visually hidden — the source band shows no page title);
 *   - every other row is one featured post: picture(s) (first = portrait rendition, second =
 *     landscape rendition; one picture serves both), a heading with the post link, a date
 *     paragraph, an optional tag list. The first post row is the primary, the rest secondary.
 *
 * Decode tier: reconstructive (repeat group) — canon masthead-insights skeleton per post, the
 * authored heading / date / list / pictures MOVED into its slots; the whole card is the link
 * (EW6: the authored inner anchor is unwrapped after reading its href).
 */

function cardFrom(row) {
  const link = row.querySelector('a[href]');
  if (!link) return null;
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const pictures = [...row.querySelectorAll('picture')];
  const paras = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture'));
  const tags = row.querySelector('ul, ol');

  const card = document.createElement('a');
  card.className = 'masthead-insights';
  card.href = link.href;
  if (link.title) card.title = link.title;
  link.replaceWith(...link.childNodes);

  const container = document.createElement('div');
  // + canon BEM alias: the replica unit family (stardust/replica/units.json) selects it
  container.className = 'masthead-insights-container masthead-insights__container';
  const inner = document.createElement('div');
  inner.className = 'masthead-insights-inner';
  const text = document.createElement('div');
  text.className = 'masthead-insights-text';
  const hgroup = document.createElement('div');
  hgroup.className = 'masthead-insights-hgroup';
  if (heading) hgroup.append(heading);
  const meta = document.createElement('div');
  meta.className = 'masthead-insights-meta';
  paras.forEach((p) => {
    const date = document.createElement('div');
    date.className = 'masthead-insights-date';
    date.append(p);
    meta.append(date);
  });
  if (tags) {
    const wrap = document.createElement('div');
    wrap.className = 'masthead-insights-tags';
    wrap.append(tags);
    meta.append(wrap);
  }
  text.append(hgroup, meta);

  const media = document.createElement('div');
  media.className = 'masthead-insights-media';
  pictures.forEach((pic, i) => {
    if (pictures.length > 1) pic.classList.add(i === 0 ? 'portrait' : 'landscape');
    media.append(pic);
  });
  inner.append(text, media);
  container.append(inner);
  card.append(container);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  const title = document.createElement('div');
  title.className = 'insight-header-title';
  const cards = [];
  rows.forEach((row) => {
    const h1 = row.querySelector('h1');
    if (h1 && !row.querySelector('a[href]')) {
      title.append(h1);
      return;
    }
    const card = cardFrom(row);
    if (card) cards.push(card);
  });

  const primary = document.createElement('div');
  primary.className = 'u-grid u-grid-default content-fluid-container';
  const secondary = document.createElement('div');
  secondary.className = 'u-grid u-grid-responsive-gap-2 content-fluid-container';
  cards.forEach((card, i) => {
    const col = document.createElement('div');
    col.className = i === 0 ? 'grid-column insight-primary' : 'grid-column insight-secondary';
    col.append(card);
    (i === 0 ? primary : secondary).append(col);
  });
  // LCP: the primary post's renditions load eagerly (source fetchpriority="high")
  cards[0]?.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
    img.fetchPriority = 'high';
  });

  block.replaceChildren(...[title, primary, secondary].filter((el) => el.children.length));
}
