<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-13T12:10:00Z
  mode: descriptive current state (replica / extract --prep)
  readArtifacts:
    - https://www.valtech.com/
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/*.json (100)
    - stardust/state.json
    - stardust/.work/blocks.json
  synthesizedInputs: []
  stardustVersion: 0.10.0
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — from the captured copy, CTAs and forms; no interview was run._

- Enterprise decision makers (the Marketo contact forms ask for role: CEO, CMO, CIO, CTO, CDO, VP, Marketing, Technology and Digital leads), evaluating a digital, commerce, data and AI partner. Source: `pages/es-es.html .contact-us-form`.
- Readers of thought leadership: blog, whitepapers, podcasts, events, Thread Magazine (`listing`, `article`, `whitepaper` page types in `stardust/state.json`).
- Job seekers: "Careers", "Explore jobs", `es-es-carrera`, `es-es-trabajar-en-valtech`.
- The crawl is Spanish-heavy: 60 of the 100 pages are `/es-es/` and 40 are global English.

## Product Purpose

Valtech's corporate marketing site. It presents the company as "The experience innovation company" (`og:title`) and turns visits into leads. The capture shows lead capture on 42 pages (`.marketo-form-block`), a site-wide "Contact us" side tab and a black "Contáctanos" / "Let’s connect" contact band (41 pages), plus gated whitepapers (`.pdf-view-block` with a form, 14 pages).

## Positioning

From the captured copy:

- "We’re the experience innovation company built to help you move faster, think bolder and deliver what’s next." (home h1)
- "At Valtech, we offer solutions designed to achieve the exceptional, helping our clients leap beyond sameness and maximize their full potential." (home meta description)
- "Turn fragmented AI into enterprise value by orchestrating data, decisions and execution across your business…" (the-intelligent-enterprise)
- Five offering pillars (es-es/servicios): Elevación de la Experiencia, Aceleración del Comercio, Transformación Empresarial, Servicios Creativos de Marketing & Performance, Revolución del Dato y la IA. The English names in the nav are Experience Elevation, Commerce Acceleration, Enterprise Transformation, Marketing Creativity & Performance and Data & AI Revolution.

## Capabilities and Constraints

- Component-based CMS output. Every page is `main#valtech-content` with an ordered list of components (`stardust/.work/blocks.json`). There are 52 recurring components, listed in `DESIGN.json#extensions.modules`.
- Page types (`stardust/state.json`): article 17, campaign 17, editorial 17, offering 15, whitepaper 14, listing 7, microsite 7, static 4, landing 2.
- Dynamic surfaces: Marketo forms2 (`go.valtech.com`) with Friendly Captcha. The es-es listings (blog, casos, content hub, eventos, noticias, podcasts) are rendered client-side by React. The home hero is a Flickity carousel.
- Locales: global EN and es-es share one origin. The header and footer have an EN and an ES label variant.

## Brand Commitments

- Register: **brand**. This is a marketing site: hero carousel, case-study cards, partner logos and lead forms, with no authentication (`_brand-extraction.json#register`).
- Name and wordmark: "Valtech", an inline SVG wordmark (`stardust/current/assets/logo.svg`, 159×36, title "Valtech, go back to homepage", desc "The Experience Innovation Company").
- Typefaces: ValtechNeue (a proprietary brand display face) and Söhne (a commercial Klim face). Both are self-hosted and flagged `private` for licensing.
- Observed personality: confident, aspirational and enterprise-AI forward. Typography is light (300 weight) and very large on a warm off-white (#f3f2ef) ground. Black is used for bands and text, and one saturated Valtech blue (#002fa7) is used for action.
- Observed anti-references: _provenance: inferred. The site uses no gradients beyond scrims, no drop shadows (rings are 2px inset), no heavy weights (300 is the dominant weight) and no rounded cards (2px).

## Evidence on Hand

- Page captures: `stardust/current/pages/<slug>.json` + `.html` (100 pages, with typed `slots`), and screenshots in `stardust/current/assets/screenshots/`.
- Computed-style census: `stardust/current/_computed-styles.json` (100 pages × 1440/360).
- Brand surface: `stardust/current/_brand-extraction.json`.
- Logo: `stardust/current/assets/logo.svg`. Favicon: `stardust/current/assets/favicon.ico`.
- Fonts: 8 files in `stardust/current/assets/fonts/` (Söhne 300/300i/400/700 woff2; ValtechNeue 300/400 woff2 and woff).
- Live CSS: `stardust/current/assets/css/` (main.css, critical-homepage.css, critical-iehub.css, homepage.css, Marketo forms2 themes).
- Real content: case studies (Eton, Discover, Lexus, Mandarin Oriental, Mars, Volkswagen Group), partner logos (Adobe, Google, Microsoft, Optimizely, Salesforce …), whitepapers, podcasts and events.
- Absences: no testimonials with attribution outside `.attributed-quote-block` (2 pages), no pricing, and no captured video hero. Do not fabricate any of these.

## Product Principles

_provenance: inferred — read from repeated structure, not stated by the owner._

1. Every page ends in a conversation: a contact form or contact band closes most interior pages.
2. Proof over claims: case-study cards, statistics blocks and partner logos recur across types.
3. Thought leadership is a product: whitepapers, podcasts and magazines are gated and treated as first-class pages.
4. One global system with local voices: the EN and ES variants share every component.

## Accessibility & Inclusion

- The breadcrumbs use `aria-label="You are here"`, and the logo SVG has a `<title>`/`<desc>`.
- 60% of the 774 captured images have empty alt text (`_brand-extraction.json` / voice detectors). The link label "here" appears 5× on 3 pages.
- The contact band names an accessibility contact for alternative formats ("Sheree Atcheson").
