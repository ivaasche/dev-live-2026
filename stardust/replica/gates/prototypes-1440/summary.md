# Prototype gate — every crafted prototype, 1440px

2026-11-13T14:48:34.203Z · **8 PASS / 1 FAIL / 0 error of 9** (+1 documented override → 9 delivered)

Verdict: overlap pixel % ≤ 10 AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **9 PASS**; full verdict (1–4): **8 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 0, units 1; content n/a (origin not probed) 0.
| page | template | tier | origin | browser | pixel % (text %) | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/es-es-aviso-legal-proposed.html` | - | - | stitch-live | chrome | 0.01 | 0 | 0 | n/a | - | PASS | - |
| `/es-es-blog-la-era-de-los-agentes-de-ia-proposed.html` | - | - | stitch-live | chrome | 0.01 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/es-es-whitepapers-la-voz-de-los-innovadores-en-experiencia-movilidad-2026-proposed.html` | - | - | stitch-live | chrome | 0.02 | 0 | 0 | n/a | - | PASS | - |
| `/valtech-conversion-engine-proposed.html` | - | - | stitch-live | chrome | 0.03 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/ai-searchandizing-workshop-proposed.html` | - | - | stitch-live | chrome | 0.06 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/es-es-la-empresa-inteligente-operar-proposed.html` | - | - | stitch-live | chrome | 0.14 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/digital-media-performance-marketing-proposed.html` | - | - | stitch-live | chrome | 0.3 | -1 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/index-proposed.html` | - | - | stitch-live | chrome | 9.29 | 0 | 0 | n/a | off 0 hidden 0 missing 0 | PASS | - |
| `/es-es-blog-proposed.html` | - | - | stitch-live | chrome | 0.01 | 0 | 0 | n/a | off 0 hidden 4 missing 0 | FAIL (elements) → PASS (documented): units only: insight-item origin selector a[data-component-name="insight-item"] contains = and is mis-split by the origin=build parser (served: bad selector; unit-geometry run directly passes it); the 4 hidden are the advisory insights-filter-select family (required:false in units.json — source caret 10x150 inside a 10x10 overflow:hidden box, clipped identically live). Pixel 0.01%, Δh 0, clip 0, content 0 missing. | units off 0 hidden 4 missing 0 |
