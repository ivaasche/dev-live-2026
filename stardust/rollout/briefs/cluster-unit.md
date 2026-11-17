# Brief — C-deliver render cluster + `cluster` unit (one template's siblings)

Hands-off stardust replica migration of https://www.valtech.com/ to AEM Edge Delivery. Work unattended; never ask questions.
Same project, hosts, DA org/repo, token rules, discipline and report shape as `stardust/rollout/briefs/archetype-unit.md` — read it first, all of it
applies (run-bg for every browser instrument and deploy batch, `wait` as the next call, no sleep, every tool call < 4 min, git add only your own paths,
never edit frozen foundation files, never touch `stardust/rollout/progress.json`, `stardust/migrate/progress.json`, `stardust/status.jsonl`,
`stardust/.labs/`, `tools/replica/`, `.env`; never print the token).

## Goal
The template's archetype is LIVE and gated (its encoder is proven). Deliver every sibling page listed for this cluster:
render (sibling tier, fork the archetype's content-doc shape — never re-author blocks) → chain → PUT → preview → live → published-origin gate row
at 1440 AND 360. DELIVERED = pixel ≤ 10 % AND |Δh| ≤ 5 % AND 0 clipped AND 0 MISSING/HIDDEN content (units clean).

## Steps
1. Contract: /home/node/adobe-skills/plugins/stardust/skills/replica/reference/handoff-contract.md § 1 (sibling tier: variance probe → clone →
   content-count acceptance) and § 3 row C (cluster unit), by section only (`section.mjs <doc> "<heading>"`, pipe through `sed -n` ranges if long).
2. Variance probe once (`sibling-variance.mjs <archetype-live-url> <sibling-urls…> --probe <block>=<sel> … --width 1440`, through run-bg);
   budget every delta as a VARIANT class inside the reused block (scoped CSS, without breaking the archetype — re-gate the archetype if you
   touch its block CSS).
3. Per sibling: content document `content/<path>.html` shaped exactly like the archetype's (`content/<archetype path>.html`), verbatim content from
   `stardust/current/pages/<slug>.json`/`.html`, metadata rows as the archetype (title, description, og, `nav-active` on /es-es/ pages …);
   migrated tree entry `stardust/migrated/<path>/index.html` + `_meta.json` if the render chain expects it (`node stardust/scripts/migrate/migrate.mjs --help`).
   Content-count acceptance per page at import time. Then the brief chain step 4 (delivery-lint, media-reconcile + da-media-upload, localize-links,
   davids-model-lint, sanitise, `npm run lint`).
4. Commit + push your paths; deploy all cluster pages in one `deploy-batch.mjs` run (paths file `stardust/rollout/units/cluster-<template>.paths`,
   ledger `stardust/deploy/ledger-cluster-<template>.json`) — it publishes.
5. Gate: `node stardust/rollout/tools/gate-state.mjs`, then `gate-all.mjs --state stardust/.work/gate-state.json --only <slug,…> --eds-host
   https://main--c87ac39f--aemcoder.aem.page --width 1440`, then `--width 360`. Before EACH width's run delete
   `stardust/current/measure/<slug>-units.json` for every gated slug (the unit-geometry origin cache is per page, not per width).
   units.json selectors never contain `=`; never declare advisory unit families (gate-all counts them). Fix rounds cap 3 per page; a page still
   failing after 3 → record it as a residual with its numbers, never a 4th round.
6. Record per page: `update-coverage.mjs <slug> --status deployed --url https://main--c87ac39f--aemcoder.aem.page<path>`;
   `migrate.mjs gate <slug> content-fidelity --evidence "…"`. Log encoder/variant decisions in `stardust/eds-conversion-log.md` under
   `## <template> cluster`. Commit + push.

## Report (final message)
`cluster-<template>: n/m delivered, 1440 max x% / 360 max y%, clipped n, missing n, rounds r, residuals [slug: reason], requests q`
then ≤ 5 lines (variants added, anything the next cluster should know).
