# Dynamic features — plan (www.valtech.com → AEM Edge Delivery)

Inventory: `stardust/dynamic-features.md` (41 rows; 17 `self`, 24 owner-gated with interim or scaffolded tiers).
Static migration never waits on this plan (triage.md rule 7): every feature first degrades to a
working static page. Reconcile against `stardust/migrated/` before each phase (absent at triage time).

## Phase A — chrome and page behaviour (self, ships autonomously)

- **Deliverables:** header mega-menu + mobile nav + locations accordion (row 29, runtime/header block);
  microsite sub-nav (27); FAQ accordion block (28); hero carousel (25) and Flickity-style sliders (26)
  as blocks with authored slide rows; modal loader in runtime for the thank-you popup (22), side modal
  (23) and acquired-brand redirect notice (24).
- **Authoring contract:** slides / FAQ items / modal copy are authored rows; no JS-only copy.
- **Verify:** chrome-compare / pixel gate at 3 breakpoints; `dynamics-check.mjs` modal + interaction
  checks (open, close, Esc, focus return); redirect notice shows only on arrival from the brand domain.
- **Effort:** M.

## Phase B — media (self)

- **Deliverables:** TwentyThree player embeds (31) re-authored from `data-embed-id` player URLs,
  click-to-load poster; background autoplay video; SoundCloud embed (32); PDF preview block (30) over
  PDFs relocated to the content bus.
- **Owner decision:** D5 (PDF hosting). Interim: relocate to content bus.
- **Verify:** player iframe src resolves; PDF preview renders first page; no requests to
  `www.valtech.com/globalassets` from migrated pages after D5.
- **Effort:** S–M.

## Phase C — Marketo forms (self, interim tier)

- **Deliverables:** one `marketo-form` block (rows 18–21): authored Intro / Success rows + `Form id`
  config; fields rendered from the live definitions (snapshot-forms → `data/forms/mkto-<id>.json`:
  labels, selects filled after settle, required marks, opt-in checkboxes, hidden UTM fields);
  submission routed client-side through Marketo Forms 2.0 (`//go.valtech.com`, `353-SAE-487`, form id)
  — `MktoForms2.loadForm` hidden, `vals()` + `submit()`; empty submission refused; thank-you popup (22)
  on success; `dataLayer.push({event:'Form Submit Marketo'})` kept for D1.
- **Owner decision:** D4 (Marketo stays production intake; new host allowed; mapping).
- **Verify:** `form-flow` check — empty submit refused with live wording; filled submit reaches
  Marketo only in a test run against a test form id the owner names (never a production lead from QA).
- **Effort:** M.

## Phase D — listings (interim, document-first)

- **Deliverables:** listing blocks for blog, casos, eventos, noticias, whitepapers, content hub,
  podcasts (33–39): generator writes one row per card (title link, excerpt, tags, date where shown) +
  a label-list row; client-only facet filters (industry / service / platform / about-us) over rows;
  index top-up once a query index exists (configured in the configuration service — `helix-query.yaml`
  is retired in this project). Pages emit the meta fields in § Listings contract at import time.
  Curated rails (40) ship as static-snapshot rows.
- **Owner decisions:** D6 (index vs curated), D7 (corpus scope — out-of-scope cards link to the source).
- **Verify:** authored rows equal the source's first page of cards; AI-readability ≥ 98 on listing
  pages; filters narrow rows with no network.
- **Effort:** L.

## Phase E — martech (scaffolded, all off)

- **Done now:** `stardust/martech-contract.json` (CMP null — injected by GTM; route
  `google-tag-manager` `enabled:false`; consent model `owner-decision`, Google Consent Mode inside GTM;
  tagNotes for GTM-WNBZ8QD: 86 rules, 58 data elements, cited), `stardust/martech-handoff.md`,
  `scripts/martech.js` (from the all-disabled contract).
- **Pending hook (not applied — scripts.js is out of this run's scope):** in `scripts/scripts.js`
  add `import('./martech.js').then((m) => m.loadConsent());` as the first line of `loadEager()` and
  `import('./martech.js').then((m) => m.loadTags());` as the first line of `loadDelayed()` (there is no
  `scripts/delayed.js`). Existing `scripts/consent-check.js` / `consented.js` (dummy consent) must be
  reconciled with the Cookiebot path when D1 is enabled.
- **dataLayer (17):** page context + custom events pushed from runtime once D1/D2 are on.
- **Owner decisions:** D1, D2, D3.
- **Verify:** `dynamics-check.mjs` `martech` feature — `/` requests no GTM / Cookiebot host while off.
- **Effort:** S now; owner-side for enablement.

## Phase F — locale (interim)

- **Deliverables:** hreflang alternates + locale switcher (41) pointing at migrated locales on the
  new host and at www.valtech.com for the rest.
- **Owner decision:** D8.
- **Effort:** S.

## Not in scope / not present

Site search (none on the source pages), auth / account (false positive), AI chat (none — "LBX" is a
case slide).
