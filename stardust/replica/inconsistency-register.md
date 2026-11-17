# Inconsistency register — valtech.com replica

The ONLY permitted design deltas for this run. No audit was requested and no
user items were supplied: the run is a pure replica. The entry below is a
handover note (deferred) — it changes nothing.

## R-01 — Content cap differs between templates

- **Evidence:** cap-probe at 2560px (DESIGN.json `extensions.breakpoints.capRegister`, `caps[]`): home caps content at 1408px, the article template at 1440px, the offering template (valtech-conversion-engine) is fluid.
- **Finding:** the three templates stop growing at different widths with no responsive cause.
- **Minimal change:** none in this run — each template keeps its own measured cap; the owner may unify on 1440px later.
- **Status:** deferred
- **Where:** landing, article, offering templates (widths > 1440px only)

## R-02 — Proprietary brand faces self-hosted (licensing alert)

- **Evidence:** `stardust/current/_brand-extraction.json#type.files[]` — ValtechNeue (proprietary brand face) and Söhne (Klim Type Foundry, commercial), both served from www.valtech.com today.
- **Finding:** not a design inconsistency — a licensing item. The faces are shipped as-is (fonts policy: brand family first, Linux metric fallback after it) so the design stays identical; the web licence must cover the new host.
- **Minimal change:** none to the design. Deploy raises the licensing alert (`fonts/LICENSING.md` + hand-off line); removing the files falls back to the metric substitute without a code change.
- **Status:** deferred
- **Where:** all templates
