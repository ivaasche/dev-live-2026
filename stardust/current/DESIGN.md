<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-13T12:20:00Z
  mode: descriptive current state (replica)
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/DESIGN.json (extensions.breakpoints from cap-probe)
    - stardust/current/assets/css/main.css
  synthesizedInputs: []
  stardustVersion: 0.10.0
-->
---
name: Valtech
description: The experience innovation company
colors:
  paper: "#f3f2ef"
  ink: "#000000"
  valtech-blue: "#002fa7"
  white: "#ffffff"
  rule-grey: "#cccccc"
  signal-cyan: "#00c8ff"
  graphite: "#484848"
  alert-red: "#ff5959"
typography:
  display-hero:
    fontFamily: "ValtechNeue, sans-serif"
    fontSize: "88px"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "normal"
  display:
    fontFamily: "ValtechNeue, sans-serif"
    fontSize: "72px"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "ValtechNeue, sans-serif"
    fontSize: "43.2px"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "ValtechNeue, sans-serif"
    fontSize: "28px"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "normal"
  title-sans:
    fontFamily: "Soehne, sans-serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Soehne, sans-serif"
    fontSize: "20px"
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: "normal"
  body-mobile:
    fontFamily: "Soehne, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Soehne, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  button:
    fontFamily: "Soehne, sans-serif"
    fontSize: "20px"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "2px"
  md: "14px"
  pill: "100px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "80px"
  xxl: "120px"
components:
  button-primary:
    backgroundColor: "{colors.valtech-blue}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "15px 40px"
  button-primary-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.valtech-blue}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.valtech-blue}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "15px 40px"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  side-tab:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.ink}"
    padding: ".3rem 2.5rem"
    width: "64px"
  contact-band:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.headline}"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
---

# Design System: Valtech (current state)

## Overview

**Creative North Star: "Light type on warm paper"** (descriptive label for the observed system, not an owner statement)

Valtech's site is built on a warm off-white ground (#f3f2ef, the `body` background on all 100 pages). Display headlines are set very large in the proprietary ValtechNeue at weight 300. Black is used two ways: for text, and as the ground of full-bleed bands such as the contact band, the footer and dark mastheads. A single saturated Valtech blue (#002fa7) is reserved for action: pill buttons, inline links and the 2px inset ring that acts as button outlines. Depth is almost flat. There are no drop shadows, card corners are 2px, and every button is a 100px pill.

Most pages share the same rhythm: breadcrumbs, then a masthead (often split two-column with a CTA), then rich-text blocks, then proof (statistics, speakers, partners, case teasers), then a form or the black "Contáctanos" band, then the footer. On desktop a fixed 64px rail at the right edge carries a rotated cyan "Contact us" tab.

**Key Characteristics:**
- Weight-300 display type (ValtechNeue) at 72–88px on mastheads, with Söhne 300 body copy at 20px/28px.
- Warm paper (#f3f2ef), black bands and one blue action colour (#002fa7).
- Pill buttons (100px radius ×607 in the census) with colour-inverting hovers.
- Near-zero radius on surfaces (2px), and no elevation shadows.
- Persistent conversion chrome: side tab, mobile bottom bar and the black contact band.

## Colors

The palette is restrained and mostly achromatic, with one saturated blue for action and a cyan used only on the side tab.

### Primary
- **Valtech Blue** (#002fa7): primary buttons (bg, 15px 40px pill), links, the inset 2px button ring (`rgb(0,47,167) 0 0 0 2px inset` ×319), and the top border of the mobile contact bar. Census role `primary`.

### Secondary
- **Signal Cyan** (#00c8ff): only on the rotated side-tab button (`.side-button .button`). It comes from the CSS; the census does not measure it.

### Neutral
- **Paper** (#f3f2ef): page background (`body`) and the secondary button ground.
- **Ink** (#000000): text, headings, and the dark band ground (contact band, footer, dark mastheads).
- **White** (#ffffff): card and section surfaces, and text on dark bands.
- **Rule Grey** (#cccccc): borders and dividers (census role `border`).
- **Graphite** (#484848): secondary links and text.
- **Alert Red** (#ff5959): Marketo form validation text.

## Typography

**Display Font:** ValtechNeue (with sans-serif). Proprietary, self-hosted, 300/400.
**Body Font:** Söhne, declared as `Soehne` (with sans-serif). Commercial Klim face, self-hosted, 300/300 italic/400/700.

**Character:** The large display type is light (300), set against a neutral grotesque body. The scale is ad-hoc (72 → 43.2 → 28 → 20 → 16; ratios 1.667, 1.543, 1.4, 1.25).

### Hierarchy
- **Display hero** (300, 88px, 1.1): home carousel slide titles.
- **Display** (300, 72px / 50.4px, 1.1): masthead h1.
- **Headline** (300, 43.2px; 64px variant, 1.2): section h2. 28px at 360.
- **Title** (300, 28px, 1.2): card and section h3. Söhne 400 36px is a sans variant.
- **Body** (300, 20px/28px): paragraphs and lists. 16px/22.4px at 360.
- **Label** (400, 16px, 1.2): eyebrows and h4 labels in Söhne.

## Layout

- Content cap (cap-probe, probe width 2560): `containerMaxWidth` 1440px. Home modules are capped at 1408px and the blog article at 1440px. valtech-conversion-engine is fluid, with module caps of 872 / 810 / 546px. The value differs between archetypes; see `DESIGN.json#extensions.breakpoints.capRegister`.
- Source breakpoints (`@media` in the live CSS): the main switch is **940px (58.75rem)**, used 1158×. Secondary breakpoints are 1024px (64rem, 328×), 1920px (120.001rem), 540px (33.75rem), 624px (39rem), 1440px (90rem) and 1536px (96rem). Legacy px queries also appear at 800, 933, 1333 and 1600. The full table is in `DESIGN.json#extensions.breakpoints.source`.
- Spacing comes from main.css padding/gap values on a 4px base: 24, 40, 16, 20 and 80px are most common. There is a secondary 5/10px rhythm (10, 30, 60px). Section padding is about 80px (5rem).

## Elevation & Depth

The site is flat. The only box-shadows are 2px inset rings in #002fa7, #fff or #000, used as button outlines. The gradients are scrims, `linear-gradient(transparent 3px, #000)` (×140), plus a #484848→transparent nav fade on the Intelligent Enterprise microsite.

## Shapes

- 100px pill on all buttons (×607).
- 50% for circular avatars and icons (×256).
- 2px on cards and surfaces (×183, the non-pill mode).
- 14px and about 23.6px appear rarely (×16 each).

## Components

- **Buttons:** primary (blue/white), secondary (paper/blue with a blue ring) and outline (white/black, 2px). All are pills, and hover inverts ground and text.
- **Site header** (`nav.site-nav`, 100 pages): inline SVG wordmark on the left and five mega-menu items (Our work, Offerings, Careers, Our insights, About us, or the ES equivalents), with a country selector.
- **Contact side tab** (`.side-button`, 41 pages): a fixed 64px paper rail on the right with a rotated #00c8ff "Contact us" tab. On mobile it is replaced by a fixed bottom bar (`.site-nav__contact-us-button`).
- **Contact band** (`.contact-us-form`, 41 pages): a black band with a 64px ValtechNeue 300 title ("Contáctanos" / "Let’s connect") and a Marketo form in an accordion.
- **Breadcrumbs** (`.site-breadcrumbs`, 90 pages).
- **Footer** (`footer.site-footer`, 100 pages): link row, social icons and "Change Cookie Settings".
- **Recurring modules:** 52 candidates in `DESIGN.json#extensions.modules`. The most common are rte-block (61 pages), marketo-form-block (42), podcast-speakers (29), masthead-two-columns-cta (28), teaser-block (24), main-article (18), masthead-primary (17), pdf-view-block (15), faq-block (13) and partners-block (12).

## Do's and Don'ts

Descriptive observations of the current site, not target rules:

- Do: the site keeps display type at weight 300, and heavy weights (700) are rare (30 of about 5,000 samples).
- Do: action colour is limited to #002fa7. Cyan appears only on the side tab.
- Don't: the site uses no drop shadows and no large card radii.
