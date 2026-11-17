<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-13T15:09:28.227Z · input stardust/current/_dynamics.json (9 pages, 58 findings) · target probe https://main--c87ac39f--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-consentcdn-cookiebot-eu | A | unknown third-party host consentcdn.cookiebot.eu | 9/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 9/9 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 8/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-experimentation-a-b-personalisation | A | experimentation: A/B / personalisation | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which experiments move to the new host |  |
| 5 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 8/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-dc-services-visualstudio-com | A | unknown third-party host dc.services.visualstudio.com | 8/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-c-6sc-co | A | unknown third-party host c.6sc.co | 8/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-unknown-third-party-host-ipv6-6sc-co | A | unknown third-party host ipv6.6sc.co | 8/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | a-unknown-third-party-host-epsilon-6sense-com | A | unknown third-party host epsilon.6sense.com | 8/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | cr-client-rendered-slot-modal-micromodal-slide-modal-redirec | CR | client-rendered slot modal micromodal-slide modal-redirect | 9/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 11 | cr-client-rendered-slot-contact-us-form-container-js-accordi | CR | client-rendered slot contact-us-form__container js-accordion | 5/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 12 | cr-client-rendered-slot-contact-us-form-column-contact-us-fo | CR | client-rendered slot contact-us-form__column contact-us-form__accordion-column js-accordion-content | 3/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 13 | cr-client-rendered-slot-hero-block-item-text-adapter-js-hero | CR | client-rendered slot hero-block__item__text-adapter js-hero-block__item__text-adapter | 2/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 14 | cr-client-rendered-slot-featured-verticals-block-content-js- | CR | client-rendered slot featured-verticals-block__content js-fv-slider-content flickity-enabled | 2/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 15 | cr-client-rendered-slot-hero-block-content-js-hero-slider-co | CR | client-rendered slot hero-block__content js-hero-slider-content flickity-enabled | 1/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 16 | cr-client-rendered-slot-pdf-view-block-viewer-toolbar-off | CR | client-rendered slot pdf-view-block__viewer toolbar-off | 1/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 17 | cr-client-rendered-slot-results-statistics-block-container-r | CR | client-rendered slot results-statistics-block_container results-statistics-block_container--4 js-flickity-result-statistic | 1/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 18 | cr-client-rendered-slot-teaser-block-container-js-flickity-t | CR | client-rendered slot teaser-block__container  js-flickity-teaser | 1/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 19 | cr-client-rendered-slot-section-iehub-nav | CR | client-rendered slot section iehub-nav  | 1/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 20 | cr-client-rendered-slot-hero-block-content-js-hero-slider-co | CR | client-rendered slot hero-block__content js-hero-slider-content | 1/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 21 | f-form-mktoform-3404-no-action-js-wired-12-fields | F | form "mktoForm_3404" → no action (JS-wired) (12 fields) | 2/9 | client-only | widget | self | pending | client-compute | none |  |
| 22 | f-form-mktoform-7474-no-action-js-wired-12-fields | F | form "mktoForm_7474" → no action (JS-wired) (12 fields) | 1/9 | client-only | widget | self | pending | client-compute | none |  |
| 23 | f-form-mktoform-7718-no-action-js-wired-8-fields | F | form "mktoForm_7718" → no action (JS-wired) (8 fields) | 1/9 | client-only | widget | self | pending | client-compute | none |  |
| 24 | f-form-mktoform-7520-no-action-js-wired-9-fields | F | form "mktoForm_7520" → no action (JS-wired) (9 fields) | 1/9 | client-only | widget | self | pending | client-compute | none |  |
| 25 | f-form-mktoform-7797-no-action-js-wired-9-fields | F | form "mktoForm_7797" → no action (JS-wired) (9 fields) | 1/9 | client-only | widget | self | pending | client-compute | none |  |
| 26 | f-form-mktoform-10078-no-action-js-wired-8-fields | F | form "mktoForm_10078" → no action (JS-wired) (8 fields) | 1/9 | client-only | widget | self | pending | client-compute | none |  |
| 27 | i18n-locale-variants-en-x-default | I18N | locale variants en,x-default | 3/9 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 28 | i18n-locale-variants-en-es-fr-fr-x-default | I18N | locale variants en,es,fr-fr,x-default | 2/9 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 29 | i18n-locale-variants-en-nl-nl-en-gb-en-us-es-pt-br-en-ca-fr- | I18N | locale variants en,nl-nl,en-gb,en-us,es,pt-br,en-ca,fr-ca,zh-cn,en-dk,fr-fr,de-de,en-sg,sv-se,es-ar,en-cn,es-mx,en-ch,x-default | 1/9 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 30 | i18n-locale-variants-en-es-x-default | I18N | locale variants en,es,x-default | 1/9 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 31 | i18n-locale-variants-en-nl-nl-en-gb-en-us-es-pt-br-en-ca-fr- | I18N | locale variants en,nl-nl,en-gb,en-us,es,pt-br,en-ca,fr-ca,zh-cn,en-dk,fr-fr,de-de,en-sg,sv-se,en-in,es-ar,en-cn,es-mx,en-ch,x-default | 1/9 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 32 | i18n-locale-variants-en-es-pt-br-fr-ca-fr-fr-de-de-es-ar-es- | I18N | locale variants en,es,pt-br,fr-ca,fr-fr,de-de,es-ar,es-mx,x-default | 1/9 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 33 | l-listing-candidate-flickity-slider-11-cards | L | listing candidate flickity-slider (11 cards) | 1/9 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 34 | l-listing-candidate-ul-11-cards | L | listing candidate ul (11 cards) | 1/9 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 35 | m-modal-trigger-thank-you-popup-button-target-outside-dom-at | M | modal trigger thank-you-popup__button → target outside DOM at capture | 1/9 (reach 7/100) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 36 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 9/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 37 | t-unknown-third-party-host-consent-cookiebot-eu | T | unknown third-party host consent.cookiebot.eu | 9/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 38 | t-marketing-marketo-munchkin | T | marketing: Marketo Munchkin | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 39 | t-unknown-third-party-host-static-ads-twitter-com | T | unknown third-party host static.ads-twitter.com | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 40 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 41 | t-unknown-third-party-host-s-emea01-idio-episerver-net | T | unknown third-party host s.emea01.idio.episerver.net | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 42 | t-unknown-third-party-host-siteimproveanalytics-com | T | unknown third-party host siteimproveanalytics.com | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 43 | t-unknown-third-party-host-az416426-vo-msecnd-net | T | unknown third-party host az416426.vo.msecnd.net | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 44 | t-unknown-third-party-host-analytics-twitter-com | T | unknown third-party host analytics.twitter.com | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 45 | t-unknown-third-party-host-t-co | T | unknown third-party host t.co | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 46 | t-unknown-third-party-host-ws-zoominfo-com | T | unknown third-party host ws.zoominfo.com | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 47 | t-unknown-third-party-host-j-6sc-co | T | unknown third-party host j.6sc.co | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 48 | t-analytics-session-replay | T | analytics: session replay | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 49 | t-unknown-third-party-host-6009581-global-siteimproveanalyti | T | unknown third-party host 6009581.global.siteimproveanalytics.io | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 50 | t-unknown-third-party-host-b-6sc-co | T | unknown third-party host b.6sc.co | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 51 | t-unknown-third-party-host-a-emea01-idio-episerver-net | T | unknown third-party host a.emea01.idio.episerver.net | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 52 | t-unknown-third-party-host-px4-ads-linkedin-com | T | unknown third-party host px4.ads.linkedin.com | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 8/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 54 | t-third-party-mount-div-data-testid-tag-manager-injected-wid | T | third-party mount <div data-testid> (tag-manager-injected widget) | 7/9 | embed-passthrough | embed | needs-credential | pending | embed-passthrough | vendor account ids stay the owner's |  |
| 55 | t-unknown-third-party-host-c-bing-com | T | unknown third-party host c.bing.com | 6/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 56 | t-unknown-third-party-host-www-linkedin-com | T | unknown third-party host www.linkedin.com | 3/9 | embed-passthrough | embed | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "www.linkedin.com" |
| 57 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 9/9 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 58 | x-sign-in-account-links | X | sign-in / account links | 1/9 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 19 row(s) — read-settings, settled-dom-snapshot, client-compute, modal-loader.
- **One owner decision batch:** 37 row(s) — inspect the XHR, add a vendor row · which experiments move to the new host · scope of the locale trees · index-driven or editorially curated? · which tags run on the new host; property ids · CMP domain script reuse on the new host.
- **Already delivered by the capture pipeline:** 1 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 21
- **capture** — 11
- **detect** — 8
- **client tools** — 6
- **locale wave** — 6
- **listings** — 2
- **embeds** — 2
- **interactive** — 1
- **register** — 1
