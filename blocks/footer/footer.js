/**
 * Footer — the valtech.com site footer (canon `footer.site-footer`), template-slotted.
 *
 * Authored document: /footer (English) or /<locale>/footer (chromePath in scripts.js); sections
 * classified by content:
 *   brand  — the `:valtech-logo-footer:` icon
 *   stamps — images; a paragraph holding only a link right after an image links that image
 *            (the link text becomes the link title, visually hidden)
 *   lists  — 1st list = footer nav, 2nd list = legal menu (a `#` link is the cookie-settings
 *            reset), the list whose links lead with an icon = social links
 *
 * @ew-exempt <p> stamp link text — text-as-metadata: the image link's title, visually hidden
 * @ew-exempt <p> social link text — text-as-metadata: the icon link's title, visually hidden
 */
import { loadFragment } from '../fragment/fragment.js';
import { chromePath } from '../../scripts/scripts.js';

const CODE = window.hlx?.codeBasePath || '';
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, cls, ...children) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  node.append(...children);
  return node;
}

async function inlineSvg(name) {
  try {
    const resp = await fetch(`${CODE}/icons/${name}.svg`);
    if (!resp.ok) return null;
    const doc = new DOMParser().parseFromString(await resp.text(), 'image/svg+xml');
    const svg = doc.querySelector('svg');
    return svg ? document.importNode(svg, true) : null;
  } catch (e) {
    return null;
  }
}

function spriteIcon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `${CODE}/icons/sprite.svg#icon-${name}`);
  svg.append(use);
  return svg;
}

/** moves the anchor's text nodes into a visually hidden span; returns the label text */
function hideText(a, keep) {
  const span = el('span', 'visually-hidden');
  [...a.childNodes].forEach((n) => {
    if (n !== keep) span.append(n);
  });
  a.append(span);
  return span.textContent.replace(/\s+/g, ' ').trim();
}

function decorateStamps(section, aside) {
  const nodes = [...section.querySelectorAll('p, picture, img')].filter((n) => n.tagName === 'P'
    || !n.closest('p'));
  let lastPic = null;
  nodes.forEach((node) => {
    if (node.tagName !== 'P') {
      lastPic = node.closest('picture') || node;
      aside.append(lastPic);
      return;
    }
    const pic = node.querySelector('picture, img');
    const links = node.querySelectorAll('a');
    if (!pic && links.length === 1 && lastPic && !node.textContent.replace(links[0].textContent, '').trim()) {
      // a link-only paragraph after an image links that image
      const a = links[0];
      const holder = lastPic.closest('p') || lastPic;
      a.title = hideText(a);
      a.prepend(lastPic);
      if (/^https?:/.test(a.getAttribute('href')) && new URL(a.href).host !== window.location.host) {
        a.target = '_blank';
      }
      if (holder !== lastPic && !holder.querySelector('picture, img')) holder.remove();
      aside.append(node);
      lastPic = null;
      return;
    }
    if (pic) lastPic = pic.closest('picture') || pic;
    aside.append(node);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await loadFragment(chromePath('footer'));
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section, :scope > div')];

  const brandLogo = el('div', 'site-footer-brand-logo');
  const nav = el('nav', 'site-footer-nav-wrapper');
  const stamp = el('aside', 'site-footer-column site-footer-stamp');
  const menu = el('div', 'site-footer-menu');

  const brand = sections.find((s) => s.querySelector('.icon-valtech-logo-footer'));
  const svg = brand ? await inlineSvg('valtech-logo-footer') : null;
  if (svg) brandLogo.append(svg);

  const lists = [];
  sections.filter((s) => s !== brand).forEach((section) => {
    const uls = [...section.querySelectorAll('ul')].filter((ul) => !ul.parentElement.closest('ul'));
    if (uls.length) lists.push(...uls);
    else if (section.querySelector('picture, img')) decorateStamps(section, stamp);
  });

  const social = lists.find((ul) => ul.querySelector('a .icon'));
  const plain = lists.filter((ul) => ul !== social);
  const [navList, legal] = plain;

  if (navList) {
    [...navList.children].forEach((li) => li.classList.add('site-footer-nav-link'));
    nav.append(navList);
  }
  if (legal) {
    legal.className = 'site-footer-menu-list';
    legal.querySelectorAll('a').forEach((a) => {
      if (a.title === a.textContent) a.removeAttribute('title');
      if (a.getAttribute('href') === '#' || /cookie-settings$/.test(a.getAttribute('href'))) {
        a.classList.add('cookiebot-reset');
      }
    });
    menu.append(legal);
  }
  if (social) {
    social.className = 'site-footer-social';
    social.querySelectorAll('a').forEach((a) => {
      const iconSpan = a.querySelector('.icon');
      const name = iconSpan && [...iconSpan.classList].find((c) => c.startsWith('icon-'));
      const icon = spriteIcon(name ? name.slice(5) : 'linkedin-footer');
      if (iconSpan) iconSpan.replaceWith(icon);
      else a.prepend(icon);
      a.title = hideText(a, icon);
      a.target = '_blank';
    });
    menu.append(social);
  }

  const root = el(
    'div',
    'site-footer',
    el(
      'div',
      'site-footer-container',
      el(
        'div',
        'site-footer-links',
        el(
          'div',
          'site-footer-column site-footer-brand',
          el('div', 'site-footer-brand-wrapper', brandLogo),
        ),
        el('div', 'site-footer-column site-footer-nav', nav),
        stamp,
      ),
      menu,
    ),
  );
  block.replaceChildren(root);
}
