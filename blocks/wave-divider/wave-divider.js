/**
 * wave-divider — a full-width decorative line-art divider between hub sections (source
 * div.section.wave-divider > .wave-divider__container.section__container
 * > .wave-divider__icon > svg; main.css wave-divider).
 *
 * Authoring: one cell holding the divider icon (`:wave-divider-light:` black strokes on white,
 * `:wave-divider-blue:` white strokes on the blue band — the source's two inline svgs).
 * Variants (block class): blue | dark — the source section theme (container side padding 0);
 * none = white (white-theme).
 *
 * Decode tier: template-slotted — canon skeleton container > icon; authored icon MOVED in (EW1).
 */

export default function decorate(block) {
  if (block.querySelector(':scope > .section-container')) return; // EW9
  const container = document.createElement('div');
  container.className = 'section-container wave-divider-container';
  const icon = document.createElement('div');
  icon.className = 'wave-divider-icon';
  const span = block.querySelector('.icon');
  if (span) {
    icon.append(span);
    const img = span.querySelector('img');
    if (img) img.loading = 'eager';
  }
  container.append(icon);
  block.replaceChildren(container);
  if (block.classList.contains('dark')) block.classList.add('dark-theme');
  else if (block.classList.contains('blue')) block.classList.add('blue-theme');
  else block.classList.add('white-theme');
}
