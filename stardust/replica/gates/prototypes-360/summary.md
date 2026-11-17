# Prototype gate — every crafted prototype, 360px

2026-11-13T15:05:52.854Z · **6 PASS / 3 FAIL / 0 error of 9** (+3 documented overrides → 9 delivered)

Verdict: overlap pixel % ≤ 10 AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **9 PASS**; full verdict (1–4): **6 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 0, units 3; content n/a (origin not probed) 0.
| page | template | tier | origin | browser | pixel % (text %) | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/es-es-aviso-legal-proposed.html` | - | - | stitch-live | chrome | 0 | 0 | 0 | n/a | - | PASS | - |
| `/es-es-blog-la-era-de-los-agentes-de-ia-proposed.html` | - | - | stitch-live | chrome | 0.02 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/es-es-whitepapers-la-voz-de-los-innovadores-en-experiencia-movilidad-2026-proposed.html` | - | - | stitch-live | chrome | 0.05 | 0 | 0 | n/a | - | PASS | - |
| `/digital-media-performance-marketing-proposed.html` | - | - | stitch-live | chrome | 0.33 | -1 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/es-es-la-empresa-inteligente-operar-proposed.html` | - | - | stitch-live | chrome | 0.52 | -1 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/index-proposed.html` | - | - | stitch-live | chrome | 5.31 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/es-es-blog-proposed.html` | - | - | stitch-live | chrome | 0.01 | 0 | 10 (allow 10) | n/a | off 0 hidden 4 missing 0 | FAIL (elements) → PASS (documented): units only: insight-item origin selector a[data-component-name="insight-item"] contains = and is mis-split by the origin=build parser (served: bad selector; unit-geometry run directly passes it); the 4 hidden are the advisory insights-filter-select family (required:false in units.json — source caret 10x150 inside a 10x10 overflow:hidden box, clipped identically live). Pixel 0.01%, Δh 0, clip 0, content 0 missing. | units off 0 hidden 4 missing 0 |
| `/valtech-conversion-engine-proposed.html` | - | - | stitch-live | chrome | 0.03 | 0 | 0 | n/a | off 0 hidden 7 missing 0 | FAIL (elements) → PASS (documented): units only: the 7 hidden are off-screen slider items (related-content teaser slider < 58.75rem, advisory teaser-block-teaser family) and CTA hover-wipe spans, clipped by design identically live (live-side probe misses it; progress/offering.json residual). Pixel 0.03%, Δh 0, clip 0, content 0 missing. | units off 0 hidden 7 missing 0 |
| `/ai-searchandizing-workshop-proposed.html` | - | - | stitch-live | chrome | 0.16 | 0 | 0 | n/a | off 0 hidden 4 missing 0 | FAIL (elements) → PASS (documented): units only: the 4 hidden are results-statistics slider cards off-screen inside the < 64rem slider viewport, clipped at the same positions live (the live-side probe does not report by-design clipping; progress/campaign.json residual). Pixel 0.16%, Δh 0, clip 0, content 0 missing. | units off 0 hidden 4 missing 0 |
