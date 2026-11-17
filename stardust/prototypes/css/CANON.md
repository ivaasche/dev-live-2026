# valtech.com replica — shared canon (FROZEN)

Owner: landing archetype (`index-proposed.html`, gated 0.00 % / Δh 0 at 1440 and 360,
chrome-parity ✓ incl. `nav=nav.site-nav` + `side=.side-button` regions, chrome crops 100 %).
Later archetypes never edit `canon.css`, `fonts/`, `img/sprite.svg`, `img/icons/`, `js/chrome.js`;
a needed change is one line in `stardust/replica/canon-requests.md`
(`<type>: <selector> — <change> — <evidence>`) and a `/* canon-request */` override in the
archetype css meanwhile.

## Files
- `css/canon.css` — tokens, fonts, base type ramp, buttons, header/nav (desktop bar, icon column,
  drop-down, mobile menu, location chooser), side "Contact us" tab, carousel controls, contact band
  (+ Marketo form), redirect modal, footer.
- `fonts/` — ValtechNeue Light/Book (woff2+woff), Söhne leicht/leicht-kursiv/buch/halbfett (R-02 licensing).
- `img/sprite.svg` — live sprite subset (`icon-search|global|close|arrow-down|arrow-link|linkedin-footer|
  youtube|instagram|apple-podcasts|sound-cloud|spotify|facebook|chevron-left|location|plus|cross` + every
  2-letter flag `icon-xx`). Use `<svg><use href="img/sprite.svg#icon-…"></use></svg>`.
- `img/icons/arrow-link--long.svg`, `arrow-strict-left.svg` — mask icons of the carousel buttons.
- `js/chrome.js` — sticky header morph, drop-down, location chooser, mobile menu + wipe, nav/location
  accordions, contact-band accordion (< 940), select floating labels.

## Tokens (`:root`)
`--font-sans` (Soehne → LiberationFallback → sans-serif), `--font-display` (ValtechNeue → …),
`--c-black --c-white --c-canvas #f3f2ef --c-rule #d1d3ca --c-ocean #002fa7 --c-coral #ff5959
--c-lime --c-cyan --c-grey-text #4c4c49 --c-grey-quote`, `--side-col 64px`,
`--header-h-mobile calc(42px + 1.5rem)`, `--container 75.5rem`, `--container-wide 88rem`, `--pill`.
Breakpoints (source's own): 58.75rem (940) layout, 64rem (1024) chrome, 96rem (1536) wide.
Box model: universal border-box, lifted from the source (`html{box-sizing:border-box} *{inherit}`).
`LiberationFallback` is a local() alias of Liberation Sans / Arimo (no derived files, no metrics);
keep it unquoted so the brand family stays the first named face.

## Classes
- Base: `h1–h6` (vw ramp + source clamps), `.lead`, `.visually-hidden`, `.hide`, `.dark-theme`,
  `.blue-theme`, `.white-theme`, `.skip-link`, `.site-content` (content root; < 64rem gets the 66px
  top pad + fixed header strip via `::before`).
- Buttons: `.button` (+ `--primary|--secondary|--tertiary`), pills `.btn--black`, `.btn--white`, `.btn--ocean`.
- Header: `nav.site-nav` > `.site-nav__menu-fixed` > `.site-nav__menu` > `.site-nav__menu-wrapper.site-nav__menu__labels`
  (`.site-nav__logo`, `ul.site-nav__menu__list > li.site-nav__menu__item > button.site-nav__menu__title`);
  `.site-nav__icons` (search/location/menu buttons, `.mobile`/`.desktop` twins) containing
  `.site-nav__overlay` (`__content-general` > `.site-nav__menu__container` > overview menu with
  `.site-nav__menu__title--button` + span twin + `ul.site-nav__menu__sublist`; `.site-nav__contact-us-button`
  = the mobile contact bar; `__content-location` > `.site-nav__locations` regions/places).
  State classes: `.ready-to-fixed-menu` (nav), `.fixed-menu` (bar), `.active` (menu container / title /
  accordion item), `.opened` (location button), `body.no-scroll.menu-open`, `.site-nav__locations.is-open`.
- Side tab: `div.side-button > a#side-button.button` (≥ 64rem only).
- Wipe: `svg.site-slope.site-slope--bottom|--top` (after the footer).
- Carousel controls: `.carousel-btn` (+ `--prev|--next`, `--long` = long arrow mask), `.carousel-dots > li(.is-selected)`,
  hidden library twins `.carousel-native` (keep them: the source DOM has them, content-diff counts them).
- Contact band: `div.contact-us-form#contact-us-form > .contact-us-form__container.js-accordion >
  .contact-us-form__column` (`h2.contact-us-form__title`, `button.contact-us-form__accordion-button`,
  `.contact-us-form__content`) + `.contact-us-form__accordion-column > .marketo-form-block >
  .marketo-form-block__container > form.mkto-form` (`.mkto-form__row(--check|--empty)`,
  `.mkto-form__col(--single)`, `.mkto-form__field(--float|--select)`, `.mkto-form__textlabel`,
  `.mkto-form__check .indicator`, `.mkto-form__html`, `.mkto-form__buttons > span > button.btn--white`).
  Spanish pages: same band, Spanish copy ("Contáctanos") — verify against the live page.
- Redirect notice: `div.modal.micromodal-slide.modal-redirect` (hidden, `.is-open` shows) — site-wide,
  after the footer; its `<header class="modal__header">` is the page's first `<header>` (the
  content-diff `header` root) — keep it.
- Footer: `footer.site-footer > .site-footer__container > .site-footer__links` (`__brand` logo,
  `__nav` links, `__stamp` images) + `.site-footer__menu` (`__menu__list`, `__social`).

## Page skeleton (copy from `index-proposed.html`)
```html
<html class="theme-light-side" lang="en">  <!-- es pages: lang="es" (icon column grows to 152px via html:not([lang=en])) -->
<head> … <link rel="stylesheet" href="css/canon.css"><link rel="stylesheet" href="css/<type>.css"> </head>
<body>
  <a id="skip-link" class="skip-link" href="#valtech-content">…</a>
  <nav class="site-nav" aria-label="Main Navigation"> … </nav>        <!-- copy verbatim; swap the 5 label
       buttons + the overview list for the page's own nav list (Spanish list on /es-es/) -->
  <div class="side-button"><a id="side-button" href="#contact-us-form" class="button">Contact us</a></div>
  <div id="valtech-wrapper"><div class="valtech-container">
    <main class="site-content" id="valtech-content" tabindex="-1"> …blocks… </main>
  </div></div>
  <div class="contact-us-form" id="contact-us-form"> … </div>        <!-- when the page has the band -->
  <footer class="site-footer"> … </footer>
  <svg class="site-slope site-slope--bottom">…</svg><svg class="site-slope site-slope--top">…</svg>
  <div class="modal micromodal-slide modal-redirect">…</div> ×4
  <script src="js/chrome.js" defer></script>
</body>
```
The overview list (`#mainMenuDropdown`) carries `style="display: none;"` exactly like the source
(the drop-down opens it); do not remove it.
