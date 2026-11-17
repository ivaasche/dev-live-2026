# Journal — valtech.com replica migration

## Extract — 100 planned pages captured live, typed into 9 templates (2026-11-13)

- `crawl.mjs --pages <site-plan> --prep --dynamics`: 100/100 captured, provenance 100/100 live, 0 failures, no bot wall.
- First pass captured with the Cookiebot dialog open (the site marks `#valtech-wrapper` aria-hidden/inert while it shows, so every heading was filtered). Fix: copied `live-session.mjs` beside the crawler so the shared storage state carries the `CookieConsent` cookie; re-crawled all 100.
- Vision check: 91 ok, 9 recaptured with `--wait slow` (lazy video posters / scroll-revealed bands) — `_crawl-log.json#visionCheck`.
- Style census 1440+360 over all 100 pages; brand surface, PRODUCT/DESIGN (+json), brand-review, 52 module candidates, typed slots, cap-probe (container 1440, fluid on offering pages).
- Fonts: ValtechNeue (proprietary) + Söhne (Klim, commercial) — licensed; substitution decided at recreate.
- Page types (component-sequence clustering): landing 2 · article 17 · listing 7 · whitepaper 14 · campaign 17 · offering 15 · editorial 17 · static 4 · microsite 7.
- Capture gaps: /es-es links 31 first-level targets not in the plan — out of scope by the fixed site plan (scope debt; rollout link audit repoints them to the source).

## Preserve direction — verbatim promotion, pure replica, dynamics triaged (2026-11-13)

- Promoted current PRODUCT.md / DESIGN.md / DESIGN.json verbatim to the root; `stardust/direction.md` (preserve mode).
- Register: 2 deferred handover entries (R-01 content cap differs per template; R-02 proprietary faces self-hosted → licensing alert). Pure replica.
- Archetypes (one per type): `stardust/replica/archetypes.json`.
- Dynamics: 41 rows, every row dispositioned (`stardust/dynamic-features.md`, `-plan.md`); owner decisions batched D1–D8 (tags on the new host, listings index, locale tree, PDF hosting…). Marketo forms submit to the source's go.valtech.com forms (interim tier, reproducible). Listings document-first.
- Martech: GTM (GTM-WNBZ8QD) + Cookiebot via GTM, consent model owner-decision; contract all-disabled; `scripts/martech.js` scaffolded and hooked into `scripts/scripts.js` (loadEager → loadConsent, loadDelayed → loadTags).

## Recreate / source-fidelity-gate — landing archetype (index) gated, canon frozen (2026-11-13)

- Shared canon authored and frozen: `stardust/prototypes/css/canon.css` (+ `CANON.md`), self-hosted ValtechNeue/Söhne, `js/chrome.js` (sticky header on scroll-up, menu drop-down, location chooser, mobile menu, contact accordion).
- index: 1440 0.00% Δh 0 · 360 0.00% Δh 0 · content-diff 0 🔴 (1 nondeterministic carousel "Slide n of 4" sr-status 🟡, residual) · clip 0 · cap-probe PASS · chrome-parity exit 0 both widths · units PASS. 3 iterations per breakpoint.
- Capture state: hero carousel frozen on slide 1 for the gate; 6 s autoplay restored at delivery.
- Approved hands-off; all other pages advanced to directed.

## Recreate / source-fidelity-gate — article archetype gated (2026-11-13)

- es-es-blog-la-era-de-los-agentes-de-ia: 1440 0.01 % Δh 0 · 360 0.02 % Δh 0 · content-diff 0 🔴 / 0 🟡 (main + chrome) · clip 0 · cap-probe PASS · 3 iters/bp. Verdict pass.
- Canon request filed (bare `a` colour order) with a scoped override in article.css; Spanish Marketo band drawn in its loaded state; motion: FAQ "Ver más" toggle + image fade-in implemented.

## Recreate / source-fidelity-gate — listing archetype gated with residuals (2026-11-13)

- es-es-blog: 1440 0.01 % Δh 0 · 360 0.01 % Δh 0 · content-diff 0 🔴 / 0 nothing-lost 🟡 · cap-probe PASS · 4 rounds/bp (one over the cap: the 4th was the post-interaction confirmation). Verdict residual.
- Residuals: 360 clip-probe ×10 = the source's own 5-line excerpt ellipsis (live shows the same 10); result count "10 resultados de un total de 997" frozen at capture.
- Filter dropdowns + sticky filter bar (≥1024) implemented; filtering and "Cargar más" need an index-backed block at delivery. Canon requests: sprite `icon-carret-down`, `icon-linkedin`; breadcrumbs into canon.
- Instrument note: unit-geometry's live cache is keyed by slug not width — run widths sequentially or pass `--force`.

## Recreate / source-fidelity-gate — whitepaper archetype gated (2026-11-13)

- es-es-whitepapers-la-voz-de-los-innovadores-en-experiencia-movilidad-2026: 1440 0.02 % Δh 0 · 360 0.05 % Δh 0 · content-diff 0 🔴 / 0 nothing-lost 🟡 (36 advisory = PDF text layer) · clip 0 · cap-probe PASS (2nd run; live PDF viewer/form load late) · 3 iters/bp. Verdict pass.
- PDF viewer page 1 and download form 7718 drawn static (restoreAtDelivery). No side tab, no contact band on this template (verified live).
- Breadcrumb separator is nbsp+"/" — canon request filed; article/listing carry the plain space until C0 applies it.

## Recreate / source-fidelity-gate — campaign archetype gated (2026-11-13)

- ai-searchandizing-workshop: 1440 0.06 % Δh 0 · 360 0.16 % Δh 0 · content-diff 0 🔴 / 0 nothing-lost 🟡 · clip 0 · cap-probe PASS · 2 iters/bp. Verdict pass.
- No contact band or side tab on this template (verified live). Stats slider < 64rem implemented; Marketo skeleton/fade logged restoreAtDelivery.
- 360 unit-geometry false FAIL from the slug-keyed live cache; `--force` run shows Δ0 (off-screen slider card clipped identically live) — justified residual.
- Canon requests: hollow ocean button with hover-wipe spans; light in-page Marketo form.

## Recreate / source-fidelity-gate — offering archetype gated (2026-11-13)

- valtech-conversion-engine: 1440 0.03 % Δh 0 · 360 0.03 % Δh 0 · content-diff 0 🔴 / 0 🟡 (main + chrome) · clip 0 · cap-probe PASS · 3 iters/bp. Verdict pass.
- No side tab / contact band; Marketo form 7797 in main. Related-content slider < 58.75rem + header fade implemented.
- units.json: `two-columns-item` re-pointed at the text box, `teaser-block-teaser` advisory (live-side clipping by design invisible to the unit probe) — logged residual.
- Canon requests: five sprite icons; hover-wipe spans + `.button--primary-hollow` into canon.

## Recreate / source-fidelity-gate — editorial archetype gated (2026-11-13)

- digital-media-performance-marketing: 1440 0.30 % Δh −1 · 360 0.33 % Δh −1 · content-diff 0 🔴 / 0 🟡 · clip 0 · cap-probe PASS · iters 3 (1440) / 2 (360). Verdict pass.
- Side tab + "Let's connect" band (Marketo 3404) present on this template; image fade-in on scroll implemented.
- In-round unit check "off 27" is the slug-keyed live cache crossing widths; `--force` runs Δ0 on all 3 `columns-rte-row` units.

## Recreate / source-fidelity-gate — static archetype gated (2026-11-13)

- es-es-aviso-legal: 1440 0.01 % Δh 0 · 360 0.00 % Δh 0 · content-diff 0 🔴 / 0 nothing-lost 🟡 · clip 0 · cap-probe PASS · 2 iters/bp. Verdict pass.
- Visual-diff image-count flag justified (4 of 5 live images are ads.twitter tracking pixels). Side tab + Spanish Marketo 7474 band reused from article.

## Recreate — all 9 archetypes authored and gated; microsite last (2026-11-13)

- es-es-la-empresa-inteligente-operar: 1440 0.13 % Δh 0 · 360 0.70 % Δh −1 · content-diff 0 🔴 / 0 nothing-lost 🟡 · clip 0 · cap-probe PASS · 3 iters/bp. Verdict pass.
- ie-hub chrome variant (`body.ie-hub-page`: icons in the top bar, no search, no side column) + sticky `.iehub-nav`; canon request filed. Marketo 10078 drawn static (live loads it intermittently → advisory EXTRA when absent).
- Post-cap fixes (card hover offset at 360, thank-you popup CSS, sub-nav CTA rest colour) — re-measured by the prototype-stage gate table.
- Recreate totals: 9/9 archetypes approved hands-off; verdicts pass ×7, residual ×2 (landing carousel sr-status, listing source ellipsis clip). Canon requests queued in stardust/replica/canon-requests.md for C0.

## Source-fidelity gate — prototype table, 9/9 archetypes delivered at 1440 and 360 (2026-11-13)

- `gate-all.mjs --stage prototype` → `stardust/replica/gates/prototypes-{1440,360}/`: pixel-only 9/9 PASS at both widths (max 9.29 % index at 1440 — carousel not frozen by gate-all; ≤ 0.70 % elsewhere), Δh ≤ 1 px, content 0 missing.
- 1440: 8 PASS + 1 documented override (es-es-blog: insight-item origin selector contains `=`, mis-split by the origin=build parser; 4 hidden = advisory filter-select caret). 360: 6 PASS + 3 documented overrides (es-es-blog as above; ai-searchandizing-workshop and valtech-conversion-engine: off-screen slider items clipped by design identically live) + `clip-allow.json` es-es-blog max 10 (source line-clamp ellipsis).
- Instrument trap: unit-geometry's live cache `stardust/current/measure/<slug>-units.json` carries no width — the first runs read the other width's numbers (off 16–99). Clear the cache before each width's run and never run two widths concurrently. Caches currently hold 360 values.

## Migrate plan — 9 archetypes rendered Path A, 91 siblings planned in 14 render clusters (2026-11-13)
- Opened replica Phase 5 (handoff). `migrate.mjs render` over the 9 approved archetypes with `--canon-css stardust/prototypes/css/canon.css`: rendered 9, refused 0. "Broken" links are out-of-plan targets (resolved at E2 link audit).
- modules[] declared per archetype from the prototypes' composite sections (rte-block = default content).
- stardust/migrate/progress.json: plan done; render units per template (≤ 8 siblings) pending — each runs after its template's C-deliver `archetype` unit.
- Publish decision recorded in stardust/eds-conversion-log.md (publish, owner decision). DA token is read via `--token-file "$ADOBE_IMS_TOKEN_FILE"`, never copied.

## A-inventory — 100 pages, 9 templates in the coverage ledger (2026-11-13)
- `inventory.mjs --state`: 9 archetypes pending, 91 content-pending. Project patch in `stardust/scripts/rollout/inventory.mjs` (logged in eds-conversion-log): roster paths were kept with a trailing slash (`/x/` vs the sidecar's `/x`, 8 duplicate rows) and roster pages joined no archetype (type ≠ archetype slug); now trailing slash stripped and type → approved archetype mapped.

## B-block — 17 distinct module blocks, each converted once (2026-11-13)
- `blocks.mjs` + `plan.mjs`: 237 instances → 17 conversions, representative-first per template.

## B2-dynamic — dynamic surface re-verified against the migrated tree and target origin (2026-11-13)
- `dynamics-plan.mjs --target-origin <preview> --migrated stardust/migrated --martech`: 58 finding rows (self 19, owner batch 37, delivered 1, host-bound 0); every row maps to a curated row of `stardust/dynamic-features.md` (41 rows group the per-host tag findings). Martech contract regenerated, still all-disabled.

## C-deliver archetype-listing — /es-es/blog live and gated at both widths (2026-11-13)
Gate row 1440 0.01% Δh 0, 360 0.75% Δh 0 (10 clips inside the declared source line-clamp allowance), content and units clean, pass at both widths.
Last failures were measurement-only: the unit-geometry origin cache is per page not per width (cleared before each width's run), `=` in units.json selectors breaks the pair split, advisory families are counted by gate-all.

## C-deliver archetype-article — the AI-agents blog post live and gated at both widths (2026-11-13)
Gate row 1440 0.06% Δh 0, 360 0.18% Δh 0, clipped 0, content and units clean, pass at both widths after 3 rounds.
Round 3: features-showcase descriptions wrapped in an inline span by the block JS (source measures the span box); 1440 units "off 16" was the per-page origin cache.

## C-deliver archetype-campaign — the AI searchandizing workshop page live and gated at both widths (2026-11-13)
Gate row 1440 0.07% Δh 0, 360 0.15% Δh 0, clipped 0, content and units clean, pass at both widths.
Units family results-statistics-item re-scoped to the stat figure of the first card (source descriptions are Office Online span soup; cards 2–4 sit outside the slider viewport on both sides).

## C-deliver static render + cluster-static — the three remaining legal/policy pages live (2026-11-13)
Privacy 5.67%/1.86%, fabric 4.87%/7.5%, cookies 3.04% at 1440 and 11.57% at 360 — the live Cookiebot declaration prints the capturing browser's consent ID/date (+115 px shift, aligned remainder 1.25%), recorded as a documented override in gates/all-360/overrides.json.
New blocks: table, cookie-declaration (static copy; Cookiebot stays disabled per the martech contract). English chrome matches (header 0.01%/0%, footer 0%/0.08%).

## C-deliver archetype-landing — the English home page live and gated at both widths (2026-11-13)
Gate row 1440 9.23% Δh 0, 360 5.92% Δh 0, clipped 0, missing 0, pass in the latest run at both widths; the 1440 number is all hero carousel slide phase (hero alone 0.00% slide-locked). English chrome crop 0%/0%.
Two foundation requests queued: Enter on "Offerings" opens the drop-down live (header contract), and presence must honour session-variable carousel headings.

## C-deliver session 4 end — 5/9 archetypes done, static cluster done; listing and article clusters in flight (2026-11-13)
Done this session: archetype-listing, -article, -campaign, -landing; render static + cluster-static. Interrupted at the spend boundary: cluster-listing (render listing) and cluster-article (render article-1/-2), both mid gate-all; their run-bg jobs stopped by PID.
Next session: resume those two clusters from their commits (gate first, redeploy only what is not live), then archetype-whitepaper/offering/editorial/microsite. units.json microsite-featured-verticals-item needs the kebab-case build selector.

## C-deliver session 5 end — 8/9 archetypes done, 6 clusters done; offering/editorial clusters and microsite archetype in flight (2026-11-13)
Done this session: cluster-listing (5/6, podcasts 360 residual), cluster-article (16/16), cluster-landing (/es-es/), archetype-whitepaper, archetype-offering, archetype-editorial, cluster-whitepaper (13/13). Stopped at the spend boundary with three units interrupted, state in stardust/rollout/progress.json notes.
Next session: archetype-microsite re-gate (round-1 code) + record; cluster-offering fix rounds (units.json scoping, heights, 11 missing) + re-gate archetype-offering; cluster-editorial author 3 pages + gate 13 live; then cluster-campaign, cluster-microsite, gate-all, final.

## C-deliver archetype-microsite — the Intelligent Enterprise "operar" hub page live and gated at both widths (2026-11-13)
Re-gated on the round-1 code (hub-nav fix): 1440 1.54 % Δh −68 / 360 1.57 % Δh −69, clipped 0, MISSING/HIDDEN 0 — PASS both widths.
New blocks hub-nav, side-by-side, related-cases, registration-form; `ie-hub` variants on four reused blocks.
Clusters offering, editorial and campaign run in parallel subagents; cluster-microsite follows.

## C-deliver cluster-offering — 14 offering siblings live, 10 pass, 4 residual after 3 rounds (2026-11-13)
Final: 1440 max 17.58 % / 360 max 19.51 %, clipped 0, MISSING 0; archetype re-gated 0.03 % / 4.22 % PASS.
Residuals (round cap): enterprise-ai-foundations-financial-services (Δh −148), es-es-servicios-revolucion-del-dato-y-ia and experience-innovation3 (autoplay video band, section-nav, two-columns widths), geo-quick-start 360 only. Revisit before final.

## C-deliver session 6 end — microsite archetype + cluster, offering cluster recorded; editorial and campaign clusters in flight (2026-11-13)
Done: archetype-microsite (1.54 % / 1.57 %), cluster-microsite 6/6 PASS both widths, cluster-offering 10/14 (4 residuals after the round cap). Stopped at the spend boundary.
Interrupted (state in stardust/rollout/progress.json notes): cluster-editorial (16/16 live, 1440 rounds done, 360 gate pending), cluster-campaign (16/16 live, rounds 1–3 done, final re-gates pending).
Next session: finish editorial + campaign gates and records, revisit the 4 offering residuals, then gate-all, final.

## C-deliver cluster-campaign — 16 campaign siblings live, 15 pass both widths, 1 residual (2026-11-13)
Closed out from the interrupted state: round-1 content was already deployed; 1440 16/16 (max 7.99 %), 360 15/16 (max 10.6 %). Residual: ai-mythbusting at 360 (10.6 %, pull-quote bands) after the 3-round cap. Sidecars + conversion-log section in a5bb901.
Also: coverage paths of the two DA folder-index pages corrected to their delivered trailing-slash URLs (/es-es/, /es-es/la-empresa-inteligente/) so the live probe hits the page itself.

## C-deliver cluster-editorial — 16 editorial siblings live, 12 pass both widths, 4 residual (2026-11-14)
1440 14/16 (max 11 %), 360 12/16 (max 15.6 %) after the round cap at each width; 6 pages fixed to PASS at 360. Residuals: diversidad-e-inclusion (cumulative offsets), ukraine-in-media (unit-geometry instrument reuse), lead-scoring (styles.css h3 rhythm, queued), carrera (combined CTA + clip). Foundation requests queued for C-final. A residual-fix pass over offering/campaign residuals runs alongside.

## C-deliver residual pass — offering 14/14, campaign 16/16 (2026-11-14)
Five residual pages fixed to PASS at both widths in 3 rounds (014acd7, e27463a, beb80d8, 47ec455), no masks or overrides; regression re-gate of every page carrying a touched block surfaced and fixed two 360 regressions. Remaining fails: the 4 editorial residuals. Next: editorial residual pass, then gate-all and final (foundation requests applied once).

## C-final foundation requests — 12 applied, 5 deferred, 3 of 4 editorial residuals delivered (2026-11-14)
Interim block copies lifted into styles.css / teaser-block.css; the source cascade check (`.rte-block img` margin-bottom 0) caught a +80 px/image regression from the static copy's values before it shipped wider. diversidad (table cell widths), ukraine (fresh per-width unit measure), carrera (secondary-hollow style + source-parity clip) PASS at both widths; lead-scoring passes pixel + height but its probes cannot reach networkidle on the EDS host (autoplay video) — tooling issue recorded. 35 pages re-gated at both widths, no regression.

## C-deliver gate-all — 100/100 delivered at both widths on the published origin (2026-11-14)
Roster run resumed with `--skip-existing`: 1440 100 PASS (home re-probed once — hero carousel slide timing; content-presence heading alignment ignores `--variable`); 360 98 PASS + 2 documented overrides (cookie policy pixel, podcasts off-canvas carousel slide hidden on both sides). 22 units false-reds at 360 traced to unit-geometry's width-blind origin cache (`current/measure/<slug>-units.json` measured at 1440); caches set aside, the 22 pages re-gated at 360 → PASS, 1440 caches restored. 16 campaign coverage rows read content-pending though live (200 on .page and .live) → recorded deployed. Coverage: 100 deployed, 100 gate pass. Next: final unit.

## C-deliver final — all units done, C-deliver closed (2026-11-14)
`foundation-freeze.mjs check` clean (21 files). Coverage holds 100 deployed / 100 gate pass. Note for any re-apply: `gates/all-360/summary.json` predates the 23-page 360 re-gate (`--only` writes `runs/`, never the summary), so `update-coverage.mjs --gate` on the summary alone flips those 23 rows to failed — apply the summary, then the run files listed in `units.gate-all.gates.runs`. Next: D-site.

## D-site — sitemap served 100 = assembled 100, 99 redirects live, / 200 (2026-11-14)
Source URLs carry a trailing slash (`/ai-assessment/`) while EDS serves `/ai-assessment` and 404s the slash form; `stardust/redirects.tsv` (98 slash rows + `/es-es` → `/es-es/`, built from coverage by `.work/rollout/probes/redirects-sheet.mjs`) went to DA as `/redirects.json`, previewed and published — 301s verified. Root served by the `index` document (source root 200, no `/` row). nav, footer and es-es variants carry `Robots: noindex` and stay out of the served sitemap.

## D2-dynamic — 25 features in parity.json, 21/21 replayed checks PASS on the published origin (2026-11-14)
Flows probed on the live origin before writing the rows: header menu opens (21 links), FAQ details toggle (100000 → 110000), hero autoplay restored (slide 0 → 1 in 7 s unpoked), TwentyThree player plays (`video-plays`), martech gate requests no GTM / Cookiebot host. Status: 10 done, 13 interim/owner-gated (forms D4 — no filled submit replayed against production Marketo; listings document-first, facets filter the authored rows only, `/query-index.json` 404 → top-up waits on D6/D7; PDF D5; locale/hreflang D8), side-modal loader pending (deferred foundation request), redirect notice decided-out, martech scaffolded all-off (D1–D3). Report: `stardust/qa/dynamics-report.md`.

## E-full-site — 100/100 verified on aem.live, gate pass 100/100 (2026-11-14)
`verify.mjs --all`: 99 verified, 1 failed on three root-relative links to pages outside the fixed plan (`/work/leading-beauty-brand/`, a casos and a servicios page on es-es/la-empresa-inteligente/operar) → repointed to www.valtech.com (scope extension rule), page re-deployed and published, re-verified. Render checks of the restoreAtDelivery entries ran in D2 (hero autoplay 0 → 1 in 7 s, TwentyThree playback, Marketo forms hydrated).

## E2-link-audit — 78 internal targets all 200, 0 localizable source links left (2026-11-14)
`localize-links` turned 72 absolute www.valtech.com links to delivered pages root-relative and normalized 23 slash forms (35 documents, re-deployed + published). GET of every internal href found 52 targets outside the fixed plan, all in nav/footer (en + es-es): repointed to www.valtech.com (68 links, decision with the list in direction.md), 4 chrome documents re-published; header unchanged (23 nav buttons, 13 expandable controls). Re-check: 78 internal targets, 0 non-200; `localize-links --check` PASS.

## F-optimize — gate green: 0 open P1, 33 P2 (all JSON-LD), 2 P3 (2026-11-14)
optimize over 100 pages on aem.live: P1 0; open P2 33 — every one `ai-search/jsonld` on a page whose SOURCE carries JSON-LD (carried into G); P3 2 title-length; 69 source-parity findings informational.

## G-aem — 33 JSON-LD findings fixed, 2 title P3s accepted as source parity, health 100/100 (2026-11-14)
autofix-aem not run: its title/description drafts would rewrite verbatim copy, and it leaves JSON-LD manual. The source JSON-LD of the 33 pages that carry it (extracted from the rendered captures, all valid) went into a `json-ld` metadata row verbatim; the EDS pipeline emits that row server-side as `<script type="application/ld+json">` (served block byte-equal to the source after parse), so no runtime code was needed. 33 pages re-deployed + published. The 2 title-length P3s are the source titles verbatim (the detector counts `&#x26;` as 6 characters) → accepted. Re-verify 100/100.

## H-report — report + 6 learnings; header parity re-run on the live host, 0 errors (2026-11-14)
`stardust/rollout/report.md`: 100/100 verified, 9/9 templates, 17/17 blocks deployed (registration-form, related-cases rows recorded deployed — live on the microsite pages), health 100/100, pixel table 100/100 at both widths, dynamic parity 21/21, owner decisions D1–D8 listed. The local done-check flagged `header_parity:stale` (contract 16:49 newer than the 16:03 comparison): chrome-explore on the live EN home (1440: 6 controls, 17 states; 390: 2 controls, 24 states) → chrome-compare 0 errors, 5 warnings (keyboard opens on the build only, source budget) → `chrome/header-parity.json`. Its other local gap, `pages_not_live:8` on `/x/` forms of the 8 archetypes, is `lib.mjs publicUrl()` inferring a folder URL from migrate's `x/index.html` — the pages are served at `/x` (sitemap, 200); the runner's done-check does not report it; recorded in `stardust/learnings.md`.

## I-dashboard — dashboard written; rollout closed (2026-11-14)
`stardust/rollout/dashboard/{index.html,data.json}`: 100 identified · 100 prototyped · 100 deployed · 31 optimised (the other 69 carry only source-parity informational findings, which the dashboard counts as open).

## Handoff — complete: 100/100 pages live on aem.live, gated at 1440 and 360, rollout A–I ended (2026-11-14)
Runner done-check `{"complete":true,"gaps":[]}`. state.json: 100 migrated. Published: 100 pages, redirects sheet (99), nav/footer + es-es variants. Martech carried over all-disabled (contract, handoff, scripts/martech.js committed; gate verified). Open for the site owner: decisions D1–D8 (`stardust/rollout/report.md` § Owner decisions open).
