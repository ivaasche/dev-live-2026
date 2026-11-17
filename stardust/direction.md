---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-13T12:04:53Z
  againstInput: https://www.valtech.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.valtech.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-13T12:04:53Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(2 entries, both deferred handover items — a pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Scope: the 100 pages of stardust/.labs/site-plan.json (fixed). Gate breakpoints: 1440 (desktop), 360 (mobile).
Source layout breakpoints kept (main switch 940px) — no --target-breakpoints.
Fonts: ValtechNeue and Söhne (licensed) are self-hosted as-is per the fonts policy, brand family first, Liberation Sans/Arimo metric fallback after it; licensing alert raised at deploy (register R-02).

## Link audit decision — out-of-plan targets repointed to the source (2026-11-14)
Scope extension rule (rollout E2): the page scope is fixed at the 100 pages of the site plan, so internal links to pages outside it point at www.valtech.com instead of 404ing on the new origin. 52 targets in nav, footer and their es-es variants (68 links) plus 3 body links on /es-es/la-empresa-inteligente/operar; uncaptured locale roots are repointed (never captured). Targets:
- /about/
- /about/accessibility/
- /about/contact-us/keep-in-touch/
- /about/offices/
- /about/stay-in-touch/
- /blog/
- /career/
- /career/jobs/
- /content-hub/
- /cookie-statement/
- /de-de/
- /diversity-inclusion/
- /en-ca/
- /en-ch/
- /en-cn/
- /en-dk/
- /en-gb/
- /en-in/
- /en-sg/
- /en-us/
- /es-ar/
- /es-es/carrera/ofertas-de-empleo/
- /es-es/quienes-somos/accesibilidad/
- /es-es/quienes-somos/contacto/keep-in-touch/
- /es-es/quienes-somos/mantente-en-contacto/
- /es-es/quienes-somos/oficinas/
- /es-es/search/
- /es-es/servicios/aceleracion-comercio/
- /es-es/servicios/elevacion-de-la-experiencia/
- /es-es/servicios/servicios-creativos-de-marketing-performance/
- /es-es/servicios/transformacion-empresarial/
- /es-mx/
- /events/
- /fr-fr/
- /industries/
- /legal-notices/
- /newsroom/
- /nl-nl/
- /offerings/commerce-acceleration/
- /offerings/data-and-ai-revolution/
- /offerings/enterprise-transformation/
- /offerings/experience-elevation/
- /offerings/marketing-creativity-performance/
- /partners/
- /podcasts/
- /privacy-notice/
- /pt-br/
- /search/
- /sv-se/
- /valtech-as-workplace/
- /whitepapers/
- /work/
- /work/leading-beauty-brand/, /es-es/casos/national-veterinary-associates-accelerated-software-delivery/, /es-es/servicios/transformacion-empresarial/servicios-gestionados/
