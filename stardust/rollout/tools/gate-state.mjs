#!/usr/bin/env node
// gate-state.mjs — writes the state file gate-all.mjs reads (pages with status "deployed" + liveUrl)
// from the rollout coverage: every page whose delivery is deployed / verified / failed.
// Usage: node stardust/rollout/tools/gate-state.mjs [--out stardust/.work/gate-state.json]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node stardust/rollout/tools/gate-state.mjs [--out stardust/.work/gate-state.json]');
  process.exit(0);
}
const oi = args.indexOf('--out');
const out = oi >= 0 ? args[oi + 1] : 'stardust/.work/gate-state.json';
const PREVIEW = 'https://main--c87ac39f--aemcoder.aem.page';
const cov = JSON.parse(readFileSync('stardust/rollout/coverage/pages.json', 'utf8')).pages;
const state = JSON.parse(readFileSync('stardust/state.json', 'utf8'));
const bySlug = new Map((state.pages || []).map((p) => [p.slug, p]));
const pages = cov
  .filter((r) => ['deployed', 'verified', 'failed'].includes(r.delivery && r.delivery.status))
  .map((r) => {
    const sp = bySlug.get(r.slug) || {};
    return {
      slug: r.slug,
      url: sp.url || r.source.sourceUrl,
      liveUrl: `${PREVIEW}${r.path === '/' ? '/' : r.path}`,
      status: 'deployed',
      type: sp.type,
      template: sp.type,
      fidelityTier: sp.status === 'approved' ? 'archetype' : 'sibling',
    };
  });
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify({ pages }, null, 2)}\n`);
console.log(`gate-state: ${pages.length} deployed pages → ${out}`);
