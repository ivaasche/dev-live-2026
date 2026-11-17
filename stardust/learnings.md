# Learnings — www.valtech.com replica run (2026-11-13 → 2026-11-14)

### gate-all `--only` re-gates leave summary.json stale
- failure class: ledger-drift
- evidence: 23 pages re-gated at 360 with `gate-all.mjs --only` (runs/2026-11-14T08-45-45-415Z…, 08-50-38-880Z…) after the width-blind units cache fix; `all-360/summary.json` (08:22) still holds the pre-fix rows. Re-applying `update-coverage.mjs --gate all-360/summary.json` alone flipped 23 verified rows to `failed` at C-final (restored from git).
- proposed change: `replica/scripts/gate-all.mjs` — `--only` merges its rows into summary.{json,md} (or `update-coverage.mjs --gate` accepts a runs dir and applies the newest row per slug); `reference/source-fidelity-gate.md` § The all-pages published-origin gate says so.
- status: pending

### unit-geometry origin cache is width-blind
- failure class: false-red
- evidence: `current/measure/<slug>-units.json` measured at 1440 was reused at 360 → 22 "units off" false-reds at 360 (journal, C-deliver gate-all).
- proposed change: `replica/scripts/gate-all.mjs` units probe — key the origin cache by width (`<slug>-units-<w>.json`).
- status: pending

### done-check infers a folder URL from migrate's `x/index.html`
- failure class: path-safety
- evidence: `rollout/lib.mjs publicUrl()` returns `/x/` for any row whose `source.migratedHtml` ends in `index.html`; deploy published the 8 archetypes as leaf documents (`/x` 200, `/x/` 301 via the redirects sheet), so the project's `done-check.mjs` reported `pages_not_live:8` while the served sitemap lists `/x`.
- proposed change: `rollout/scripts/lib.mjs` — derive the public URL from the delivered document (`delivery.deployedUrl` path, or the content file `content/x.html` vs `content/x/index.html`), not from the migrate artifact layout.
- status: pending

### source URLs with a trailing slash need a redirects sheet even when path-safety emits nothing
- failure class: path-safety
- evidence: every source URL ends in `/` (`/ai-assessment/`); EDS serves `/ai-assessment` and 404s the slash form. No `stardust/redirects.tsv` existed at D-site; 99 rows were built from coverage and published.
- proposed change: `rollout/SKILL.md` § Phase D — always seed redirects from coverage (`source.sourceUrl` path vs delivered path), slash forms included; `seed-redirects.mjs` should work from coverage alone when no spec knowledge exists.
- status: pending

### source JSON-LD is not carried by migrate
- failure class: content-loss
- evidence: optimize flagged 33 `ai-search/jsonld` P2 on pages whose source carries JSON-LD (Report, Service, CreativeWork, Article graph). Fixed by a verbatim `json-ld` metadata row; the EDS pipeline emits it server-side as `<script type="application/ld+json">`.
- proposed change: `migrate/reference/metadata-and-jsonld.md` § Page-specific, preserved — in the replica flow, carry the captured JSON-LD verbatim as the `json-ld` metadata row (no runtime code needed).
- status: pending

### chrome documents keep links to out-of-plan pages
- failure class: link-404
- evidence: nav/footer (en + es-es) carried 68 root-relative links to 52 targets outside the fixed 100-page plan; `verify.mjs` does not check chrome documents, so they surfaced only at E2's GET sweep.
- proposed change: `rollout/scripts/verify.mjs` — include `/nav`, `/footer` and locale variants in the internal-link check; `deploy/scripts/localize-links.mjs` — a `--repoint-missing <origin>` mode for root-relative targets outside the content tree.
- status: pending
