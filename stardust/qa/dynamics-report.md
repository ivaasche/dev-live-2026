# Dynamics parity check — https://main--c87ac39f--aemcoder.aem.live — 2026-11-14T09:02:45.948Z

Replayed 21 checks over 26 features · pass 21 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Header mega-menu, mobile nav, locations accordion | M | done | dom-count | PASS | 10 × header button.site-nav-menu-title (min 5) | go.valtech.com:200×1 |
| FAQ accordion | M | done | dom-count | PASS | 6 × .faq-block-list-item-toggle (min 6) | go.valtech.com:200×1 |
| Homepage / landing hero carousel | CR | done | dom-count | PASS | 4 × .hero-block-item (min 4) | go.valtech.com:200×1 |
| Featured verticals, teaser, results-statistics, offering sliders | CR | done | dom-count | PASS | 22 × .featured-verticals-block a (min 10) | go.valtech.com:200×1 |
| Intelligent-enterprise microsite sub-nav | CR | done | dom-count | PASS | 6 × .hub-nav-item (min 6) | go.valtech.com:200×1 |
| PDF preview viewer | CR | interim | dom-count | PASS | 3 × .pdf-view-block canvas (min 1) | cdn.jsdelivr.net:200×2 :200×1 go.valtech.com:200×1 |
| Video players (TwentyThree) + autoplay background video | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 38 (ok) | videos.valtech.com:200×34 fonts.googleapis.com:200×2 :206×2 go.valtech.com:200×2 munchkin.marketo.net:200×4 353-sae-487.mktoresp.com:200×1 ttcontacts.com:200×1 videos.valtech.com:302×4 delivery.twentythree.com:200×2 delivery.twentythree.com:206×2 report.23video.com:200×6 |
| SoundCloud podcast player | V | done | dom-count | PASS | 1 × .latest-podcast-block iframe[src*="soundcloud.com"] (min 1) | w.soundcloud.com:200×1 widget.sndcdn.com:200×7 dwt.soundcloud.com:200×2 :200×1 go.valtech.com:200×1 api-widget.soundcloud.com:200×2 i1.sndcdn.com:200×1 wave.sndcdn.com:200×1 |
| Contact form (Marketo 3404) | F | interim | dom-count | PASS | 13 × .contact-form form.mkto-form input (min 8) | go.valtech.com:200×1 |
| Contact form (Marketo 7474) | F | interim | dom-count | PASS | 13 × form.mkto-form input (min 8) | go.valtech.com:200×1 |
| Whitepaper download gate (Marketo 7718 + long tail) | F | interim | dom-count | PASS | 11 × .marketo-form form.mkto-form input (min 8) | go.valtech.com:200×1 |
| Campaign / event registration forms | F | interim | dom-count | PASS | 4 × .registration-form form, .registration-form a (min 1) | go.valtech.com:200×1 |
| Blog listing | L | interim | dom-count | PASS | 10 × .insights-filter a.insight-item (min 10) | go.valtech.com:200×1 |
| Cases listing | L | interim | dom-count | PASS | 6 × .insights-filter a.insight-item (min 6) | go.valtech.com:200×1 |
| Whitepapers listing | L | interim | dom-count | PASS | 6 × .insights-filter a.insight-item (min 6) |  |
| Events listing | L | interim | dom-count | PASS | 8 × main a[href*='/es-es/eventos/'] (min 5) |  |
| News listing | L | interim | dom-count | PASS | 27 × .news-overview a[href] (min 10) |  |
| Podcasts listing + filter | L | interim | dom-count | PASS | 8 × main a[href*='podcast'] (min 3) | w.soundcloud.com:200×1 widget.sndcdn.com:200×7 dwt.soundcloud.com:200×2 :200×1 go.valtech.com:200×1 api-widget.soundcloud.com:200×2 i1.sndcdn.com:200×1 wave.sndcdn.com:200×1 |
| Curated card rails | L | done | dom-count | PASS | 2 × .related-cases a (min 2) | go.valtech.com:200×1 |
| Analytics, tags and consent (GTM-WNBZ8QD, Cookiebot, GA4, …) — rows 1–17 | T | scaffolded-awaiting-owner | martech | PASS | no tag host requested (3 gated · 1 cross-site host(s) blocked) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (1 gated · 1 cross-site host(s) blocked) |  |

## Features without checks

- Post-submit thank-you modal (M) — interim · owner: D4 — test form id
- Side modal (M) — pending G-aem
- Acquired-brand redirect notice (M) — decided-out
- Content hub (L) — interim · owner: D6
- Locale trees, hreflang + switcher (I18N) — interim · owner: D8 — locale scope
