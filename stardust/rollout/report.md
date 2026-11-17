# rollout — www.valtech.com → aem-eds (2026-11-14)

```
rollout — https://www.valtech.com/ → aem-eds (main--c87ac39f--aemcoder.aem.live, published)
==================================================
Pages       100 total · 100 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale
Templates   9 (campaign 17/17 · offering 15/15 · editorial 17/17 · article 17/17 · whitepaper 14/14 · listing 7/7 ·
            microsite 7/7 · static 4/4 · landing 2/2 — every template delivered)
Blocks      17 deduped modules, 17 deployed; 74 block folders in the project
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 (33 JSON-LD fixed, 2 title P3 accepted as source parity; 69 source-parity informational)
Pixel table prototypes 9/9 delivered at 1440 and 360 (overrides documented) · deployed 100/100 delivered at 1440 and 360
            (1440: 100 PASS; 360: 98 PASS + 2 documented overrides) — gates/all-{1440,360}/summary.json + runs/ (see note)
To deliver  none
Content     none awaiting content
```

Note — the 360 roster table: `all-360/summary.json` predates the 23-page re-gate run
(`runs/2026-11-14T08-45-45-415Z-ai-searchandizing-workshop.json`, `…08-50-38-880Z-es-es-podcasts.json`);
the per-page verdicts in coverage come from the summary plus those runs (rollout/progress.json
`units.gate-all.gates.runs`).

## Site assembly
Sitemap served 100 = assembled 100 · redirects sheet 99 rows (source trailing-slash URLs → delivered paths), 301 verified ·
`/` 200 · nav/footer (+ es-es) `Robots: noindex`, published · 78/78 internal link targets 200; 52 out-of-plan targets
repointed to www.valtech.com (decision in `stardust/direction.md`).

## Dynamic parity (stardust/qa/dynamics-report.md)
21/21 replayed checks PASS on the published origin. 25 features: 10 done (header menu, FAQ, hero carousel autoplay,
sliders, microsite sub-nav, TwentyThree video playback, SoundCloud, curated rails …), 13 interim awaiting owner decisions
(Marketo forms D4 — filled submit not replayed against production; listings document-first D6/D7 — `/query-index.json`
not configured; PDF hosting D5; hreflang/locale D8), side-modal loader pending, acquired-brand redirect notice decided-out,
martech (GTM-WNBZ8QD, Cookiebot, GA4 …) scaffolded with every part disabled (D1–D3) — no tag host requested.

## Owner decisions open
D1 tag manager on · D2 consent model · D3 server-side collector · D4 Marketo intake + a test form id · D5 PDF hosting ·
D6 listing index vs curated · D7 listing corpus scope · D8 locale scope / hreflang. Martech hand-off: `stardust/martech-handoff.md`.
