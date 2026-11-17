# Dynamic features — www.valtech.com (replica → AEM Edge Delivery)

Curated from `stardust/current/_dynamics.json` (9 archetype pages probed, 58 findings, reach over 100/100
crawled pages) and `stardust/dynamics/dynamic-features.generated-plan.md` (target probe
`https://main--c87ac39f--aemcoder.aem.page`). Contract: dynamics `reference/triage.md`. Run mode:
hands-off — every non-`self` row ships its interim tier and names the owner decision; nothing here is
`decided-out` (that takes an owner statement).

Verified against the brief's expected surface:
- **No AI chat modal exists.** The "Revonic" modal is an acquired-brand redirect notice
  (`.modal.micromodal-slide.modal-redirect`, `data-url` = revonic.com / www.evident.nl /
  www.berndtgroup.net / www.appsolutely.nl, "In 5 seconds you will be redirected to valtech.com"), on
  100/100 pages. "LBX" is the Lexus LBX AI-Concierge case slide in the homepage hero carousel.
- **No site search** on any of the 100 crawled pages (no `role=search` / `name=query`); GTM still
  carries a `/search/` rule (rules[72]) — evidence only, nothing to rebuild.
- **No header contract** (`stardust/chrome/header-contract.json` absent), so `--chrome` added no rows;
  the header/mobile-nav row below is curated from crawl evidence.

## Listings contract

Seven React-hydrated listing pages (`<react data-react-component-name=…>`), each fed by a first-party
endpoint that is **host-bound** (404 on the target): `InsightsOverview` /es-es/blog/ →
`/categoryfilter/insights`; `CasesOverview` /es-es/casos/ → `/categoryfilter/categories`;
`EventsPage` /es-es/eventos/ → `/eventsfilter/events`; `NewsPage` /es-es/noticias/ →
`/newsapi/getnews`; `WhitepapersOverview` /es-es/whitepapers/ → `/categoryfilter/whitepapers`;
`HubPage` content hub → `/contenthub/getjsonresult`; `PodcastFilter` /es-es/podcasts/ →
`/categoryfilter/podcasts`. Document-first (listings.md § Block contract): the generator writes one
row per card with exactly the card text, then a label-list row (filter labels "Todas las industrias",
"Servicios", "Cargar eventos pasados", results label "resultados de un total de"); the block reads the
index only for images and to top up newer items. Filters are client-only over the rows.

Per content type, the `<meta name>` fields each page must emit (metadata block, Tier 2) — the source
carries these only in its dataLayer (`categoryTags.*`, GA4 `ep.tags_*`), not as meta:

| content type (path) | fields | index read by |
|---|---|---|
| blog article `/es-es/blog/*` | title, description, image (og:image), `template`=article, `industrytags`, `servicetags`, `platformtags`, `aboutustags`, `publishdate` (ISO) | blog listing (`InsightsOverview`), related rails |
| case `/es-es/casos/*` | title, description, image, `template`=case, `industrytags`, `servicetags` (cards show both) | casos listing |
| event `/es-es/eventos/*` | title, description, image, `template`=event, `eventdate` (ISO), `eventlocation`, `servicetags`, `past` derived from `eventdate` | eventos listing |
| news `/es-es/noticias/*` | title, description, image, `template`=news, `publishdate` | noticias listing |
| whitepaper `/es-es/whitepapers/*` | title, description, image, `template`=whitepaper, `industrytags`, `servicetags` | whitepapers listing |
| podcast episode | title, description, image, `template`=podcast, `industrytags`, `servicetags` | podcasts listing |
| content-hub item | title, description, image, `template`, `contenttype` | content hub |

Index: `/query-index.json` is 404 on the target. Note the project rule (AGENTS.md): `helix-query.yaml`
is retired here — index definitions live in the configuration service (tools.aem.live), so the
index is configured there from this contract, not as a yaml file in the repo.

## Features

| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | t-cmp-cookiebot | Cookiebot CMP, cbid 9ff02350-286d-45c0-ae57-9a4a20538f5c, injected by GTM (template tag 180, Consent Mode on, cdnRegion eu) | T | 100/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1: carry Cookiebot to the new host (domain added in the Cookiebot account); `consent.cmp` stays off because GTM injects it | consent.cookiebot.eu, consentcdn.cookiebot.eu/consentconfig/{cbid}; GTM resource.tags[8], rules[4] |
| 2 | t-gtm | Google Tag Manager GTM-WNBZ8QD (v317, 173 tags) + server-side collector tag.valtech.com/g/collect | T | 100/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 + D2: enable route `google-tag-manager`; collector CNAME tag.valtech.com stays the owner's; rewrite DOM-selector triggers (martech-handoff.md) | martech-contract.json routes[0] (enabled:false); tagNotes 86 rules / 58 data elements |
| 3 | t-google-ads-ga4 | GA4 (`__googtag`, 42 `__gaawe` events), Google Ads / Floodlight / remarketing | T | 100/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 (inside GTM) | www.google.com/ccm, /rmkt; ad.doubleclick.net (17/100) |
| 4 | t-optimizely | Optimizely Web experimentation (project 22275741750) | A | 100/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D3: which experiments move (they target source DOM) | cdn.optimizely.com, a21806970019.cdn.optimizely.com, logx.optimizely.com; GTM tags 693/953 |
| 5 | t-linkedin-insight | LinkedIn Insight (partners 8502217, 5724865) | T | 100/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | px.ads / px4.ads.linkedin.com, snap.licdn.com, www.linkedin.com |
| 6 | t-meta-pixel | Meta pixel | T | 8/9 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | connect.facebook.net, www.facebook.com |
| 7 | t-x-pixel | X/Twitter pixel | T | 8/9 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | static.ads-twitter.com, analytics.twitter.com, t.co |
| 8 | t-clarity | Microsoft Clarity session replay | T | 91/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | clarity.ms; GTM tags 932-939 |
| 9 | t-bing-uet | Microsoft Ads UET | T | 6/9 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | c.bing.com |
| 10 | t-6sense | 6sense (web tag + company details) | T | 100/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | j/b/c/ipv6.6sc.co, epsilon.6sense.com; GTM tag 759 |
| 11 | t-zoominfo | ZoomInfo pixel (US visitors only) | T | 8/9 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | ws.zoominfo.com; GTM rules[71] |
| 12 | t-siteimprove | Siteimprove analytics | T | 8/9 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | siteimproveanalytics.com, 6009581.global.siteimproveanalytics.io |
| 13 | t-idio | Optimizely Content Intelligence (idio) | T | 8/9 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 (tied to the old CMS; owner may retire) | a/s.emea01.idio.episerver.net; GTM tag 143 |
| 14 | t-app-insights | Azure Application Insights (source-platform telemetry) | T | 100/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 (no consumer on EDS; owner may retire) | az416426.vo.msecnd.net, dc.services.visualstudio.com/v2/track |
| 15 | t-marketo-munchkin | Marketo Munchkin 353-SAE-487 | T | 8/9 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | munchkin.marketo.net, 353-sae-487.mktoresp.com; GTM tag 28 |
| 16 | t-tradedesk | The Trade Desk conversion pixel (3 campaign pages) | T | 3/100 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | D1 | insight.adsrvr.org; GTM rules[75] |
| 17 | a-datalayer | dataLayer page context + custom events (pageCategory, categoryTags.*, Form Submit Marketo, cta_click, video:*, popup*) | A | 100/100 | rebuild-native | runtime | self | pending | read-settings | built with D1 enablement (no consumer while GTM is off) | GTM data elements in martech-contract.json tagNotes |
| 18 | f-marketo-contact-en | Contact form "Let's connect" (Marketo 3404, 12 fields) | F | 22/100 | rebuild-native | block | self | interim | marketo-forms2-passthrough | D4: confirm Marketo stays the production intake and the new host is allowed; field mapping = form 3404 | mktoForm_3404; go.valtech.com getForm 200; contact-us-form__container js-accordion |
| 19 | f-marketo-contact-es | Contact form "Contáctanos" (Marketo 7474, 12 fields) | F | 32/100 | rebuild-native | block | self | interim | marketo-forms2-passthrough | D4 | mktoForm_7474; getForm 200 |
| 20 | f-marketo-download | Whitepaper download gate (Marketo 7718, 8 fields) + per-page long tail (6942, 5609, 2047…) | F | 22/100 | rebuild-native | block | self | interim | marketo-forms2-passthrough | D4 + D5 (where the gated PDF lives) | mktoForm_7718; /index.php/form/getForm proxy host-bound → use go.valtech.com |
| 21 | f-marketo-registration | Campaign / offering / event registration (Marketo 7520, 7797, 10078, 10042 + ~20 single-page ids) | F | 45/100 | rebuild-native | block | self | interim | marketo-forms2-passthrough | D4 | mktoForm_7520/7797/10078; `#register-form` anchors |
| 22 | m-thank-you-popup | Post-submit "Solicitud recibida" modal | M | 7/100 | rebuild-native | runtime | self | pending | modal-loader | none | thank-you-popup__button |
| 23 | m-side-modal | Side modal (js-open-side-modal) | M | 3/100 | rebuild-native | runtime | self | pending | modal-loader | none | guia-para-la-empresa-inteligente, eventos-…shoptalk, thread-magazine |
| 24 | m-redirect-notice | Acquired-brand redirect notice (Revonic, Evident, Berndt Group, Appsolutely) | M | 100/100 | rebuild-native | runtime | self | pending | modal-loader | none (trigger = arrival from the brand domain; confirm in Phase 4) | modal-redirect data-url=revonic.com … |
| 25 | cr-hero-carousel | Homepage / landing hero carousel (Flickity) | CR | 6/100 | rebuild-native | block | self | pending | carousel | none — slides are authored rows | js-hero-slider-content flickity-enabled |
| 26 | cr-flickity-carousels | Featured verticals, teaser, results-statistics, offering sliders | CR | 38/100 | rebuild-native | block | self | pending | carousel | none | js-fv-slider-content, js-flickity-teaser, js-flickity-result-statistic |
| 27 | cr-iehub-nav | Intelligent-enterprise microsite sub-nav | CR | 7/100 | rebuild-native | block | self | pending | chrome | none | section.iehub-nav |
| 28 | m-faq-accordion | FAQ accordion | M | 18/100 | rebuild-native | block | self | pending | accordion | none | faq-block__list__item__toggle |
| 29 | x-header-mobile-nav | Header mega-menu, mobile nav, locations accordion | M | 100/100 | rebuild-native | runtime | self | pending | chrome | none | site-nav js-accordion, site-nav__icons button |
| 30 | v-pdf-preview | PDF preview viewer (pdf-view-block) | CR | 15/100 | data-fed | block | self | pending | asset-relocation | D5: PDFs move to the content bus (source /globalassets path is host-bound) | pdf-view-block__viewer data-url=/globalassets/…pdf |
| 31 | v-video-23video | Video players (TwentyThree, videos.valtech.com) + autoplay background video | V | 21/100 | embed-passthrough | embed | self | pending | embed-passthrough | none — player URLs are public | video-block__iframe, data-embed-id, videos.valtech.com/api/concatenate |
| 32 | v-soundcloud | SoundCloud podcast player | V | 1/100 | embed-passthrough | embed | self | pending | embed-passthrough | none | w.soundcloud.com (es-es/podcasts) |
| 33 | l-blog | Blog listing (InsightsOverview) | L | 1/100 | index-backed | block | needs-business-decision | interim | listing-index-backed | D6: index-driven vs curated; D7 corpus scope | /categoryfilter/insights host-bound |
| 34 | l-casos | Cases listing (CasesOverview) | L | 1/100 | index-backed | block | needs-business-decision | interim | listing-index-backed | D6, D7 | /categoryfilter/categories host-bound |
| 35 | l-eventos | Events listing (EventsPage, past/upcoming) | L | 1/100 | index-backed | block | needs-business-decision | interim | listing-index-backed | D6, D7 | /eventsfilter/events host-bound |
| 36 | l-noticias | News listing (NewsPage) | L | 1/100 | index-backed | block | needs-business-decision | interim | listing-index-backed | D6, D7 | /newsapi/getnews host-bound |
| 37 | l-whitepapers | Whitepapers listing (WhitepapersOverview) | L | 1/100 | index-backed | block | needs-business-decision | interim | listing-index-backed | D6, D7 | /categoryfilter/whitepapers host-bound |
| 38 | l-content-hub | Content hub (HubPage) | L | 1/100 | index-backed | block | needs-business-decision | interim | listing-index-backed | D6, D7 | /contenthub/getjsonresult host-bound |
| 39 | l-podcasts | Podcasts listing + filter (PodcastFilter) | L | 1/100 | index-backed | block | needs-business-decision | interim | listing-index-backed | D6, D7 | /categoryfilter/podcasts host-bound |
| 40 | l-related-rails | Curated card rails (home 11-card slider, article related list) | L | 2/9 | static-snapshot | block | self | pending | settled-dom-snapshot | reason: editorially curated on the source; unfreeze if owner chooses index (D6) | flickity-slider 11 cards; ul 11 cards |
| 41 | i18n-locale-tree | 19 locale trees, hreflang + locale switcher (replica scope: en root + es-es) | I18N | 100/100 | rebuild-native | runtime | needs-business-decision | interim | locale-tree | D8: locale scope; interim = hreflang/switcher link to www.valtech.com for locales not migrated | hreflang en, es, fr-fr, de-de, nl-nl, … |

Merged draft rows (each inherits the disposition of the row it joined):
`a-unknown-third-party-host-consentcdn-cookiebot-eu`, `t-unknown-third-party-host-consent-cookiebot-eu` → 1 ·
`t-tag-manager-google-tag-manager` → 2 · `a-unknown-third-party-host-www-google-com` → 3 ·
`a-experimentation-a-b-personalisation` → 4 · `a-…-px-ads-linkedin-com`, `t-…-px4-ads-linkedin-com`,
`t-…-www-linkedin-com` → 5 · `t-marketing-ad-retargeting-pixel` → 3/5/6 · `t-…-www-facebook-com` → 6 ·
`t-…-static-ads-twitter-com`, `t-…-analytics-twitter-com`, `t-…-t-co` → 7 · `t-analytics-session-replay` → 8 ·
`t-…-c-bing-com` → 9 · `a-…-c-6sc-co`, `a-…-ipv6-6sc-co`, `a-…-epsilon-6sense-com`, `t-…-j-6sc-co`,
`t-…-b-6sc-co` → 10 · `t-…-ws-zoominfo-com` → 11 · `t-…-siteimproveanalytics-com`,
`t-…-6009581-global-siteimproveanalyti` → 12 · `t-…-s-emea01-idio-episerver-net`,
`t-…-a-emea01-idio-episerver-net` → 13 · `a-…-dc-services-visualstudio-com`, `t-…-az416426-vo-msecnd-net` → 14 ·
`t-marketing-marketo-munchkin` → 15 · `a-cms-app-settings-object-datalayer` → 17 ·
`f-form-mktoform-3404-…` → 18 · `f-form-mktoform-7474-…` → 19 · `f-form-mktoform-7718-…` → 20 ·
`f-form-mktoform-7520-…`, `f-form-mktoform-7797-…`, `f-form-mktoform-10078-…`,
`x-sign-in-account-links` (false positive: `#register-form` anchor, no auth surface),
`t-third-party-mount-div-data-testid-…` (Marketo form DOM) → 21 · `cr-…-contact-us-form-container-…`,
`cr-…-contact-us-form-column-…` → 18/19 · `m-modal-trigger-thank-you-popup-…` → 22 ·
`cr-…-modal-micromodal-slide-modal-redirec` → 24 · `cr-…-hero-block-item-text-adapter-…`,
both `cr-…-hero-block-content-js-hero-slider-co` → 25 · `cr-…-featured-verticals-…`,
`cr-…-results-statistics-…`, `cr-…-teaser-block-container-…` → 26 · `cr-…-section-iehub-nav` → 27 ·
`cr-…-pdf-view-block-viewer-toolbar-off` → 30 · `v-iframe-without-src-runtime-injected-embed`
(Cookiebot / Optimizely / Marketo xdframe helper iframes, no player) → 1/4/18 ·
`l-listing-candidate-flickity-slider-11-cards`, `l-listing-candidate-ul-11-cards` → 40 ·
six `i18n-locale-variants-*` rows → 41.

## Decision batch

One message to the owner (hands-off: each is recorded as the run's named assumption; the interim
path ships; none is `decided-out`).

- **D1 — Tags and consent on the new host** (rows 1–16): the contract carries the source's stack
  (Cookiebot via GTM-WNBZ8QD, Google Consent Mode inside GTM) with every part `enabled:false`.
  Owner: add the EDS host to the Cookiebot domain list, set `routes[google-tag-manager].enabled`, re-run
  `martech-scaffold.mjs`. Retire-or-keep calls for App Insights (14) and idio (13) are the owner's.
  Interim: nothing loads (`stardust/martech-handoff.md`).
- **D2 — Tag rewrite** (row 2): GTM click/selector triggers read source DOM (`nav.site-nav`,
  `footer.site-footer`, `iehub-nav__item`, `teaser-block__teaser__inner`, `react > div > div > ul > li > a`,
  …) and custom dataLayer events; the server-side collector `tag.valtech.com` is the owner's CNAME.
- **D3 — Optimizely experiments** (row 4): which experiments move; all target source selectors.
- **D4 — Marketo intake** (rows 18–21): interim = form UI rebuilt from the live definitions, submission
  routed client-side through Marketo Forms 2.0 (`go.valtech.com`, munchkin 353-SAE-487, same form ids;
  getForm verified 200 off-origin). Owner confirms Marketo stays the production intake, hidden UTM /
  `websiteEvents` mapping, and success/thank-you behaviour. Not `regulated-pii`.
- **D5 — Gated and previewed PDFs** (rows 20, 30): copy the `/globalassets` / `/contentassets` PDFs to the
  content bus (interim) vs keep linking the source host until decommission.
- **D6 — Listings source** (rows 33–40): index-driven (query index over migrated pages, document-first
  rows + top-up) vs editorially curated. Interim: document-first rows from the settled source DOM.
- **D7 — Listing corpus** (rows 33–39): the source lists far more items than the 100 migrated pages;
  out-of-scope cards link to www.valtech.com until those pages migrate (parity note, not a gap).
- **D8 — Locale scope** (row 41): which of the 19 locale trees migrate; interim keeps hreflang and the
  switcher pointing at www.valtech.com for locales not migrated.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| — | none: no owner statement and no hard blocker; every row above ships an interim tier | — |
