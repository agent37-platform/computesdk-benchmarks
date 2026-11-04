/**
 * Cost of one Dax build per provider, from the repo's own two datasets:
 * the median build time in results/sandbox-dax/latest.json and the list rates
 * in pricing.json. Only providers present in both, with a successful build, are
 * ranked. Each provider is priced at the shape the Dax board asks it for
 * (8 vCPU / 16 GiB; Agent37 4 vCPU / 16 GiB, its largest), at the full rate,
 * since a build keeps the CPU busy. Agent37 bills by the started minute, so its
 * build time is rounded up to whole minutes; everyone else is per second.
 *
 *   npx tsx docs/agent37/cost-per-build.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const dax = JSON.parse(fs.readFileSync(path.join(root, 'results/sandbox-dax/latest.json'), 'utf8'));
const pricing = JSON.parse(fs.readFileSync(path.join(root, 'pricing.json'), 'utf8'));

const rows = [];
for (const r of dax.results) {
  const ok = r.iterations.filter((i: any) => !i.error && i.totalMs > 0);
  const p = pricing.providers.find((x: any) => x.id === r.provider);
  if (!ok.length || !p) continue;
  const agent37 = r.provider.startsWith('agent37');
  const vcpu = agent37 ? 4 : 8;
  const gib = 16;
  const n = p.pricing.normalized;
  const perHr = n.cpu_per_vcpu_hr * vcpu + n.memory_per_gib_hr * gib;
  const seconds = r.summary.totalMs.median / 1000;
  const billed = agent37 ? Math.ceil(seconds / 60) * 60 : seconds;
  rows.push({ provider: r.provider, shape: `${vcpu}/${gib}`, seconds: Math.round(seconds), perHr, cost: (perHr * billed) / 3600 });
}
rows.sort((a, b) => a.cost - b.cost);
console.log('| # | Provider | Shape | Build (s) | $/hr at shape | $ per build |');
console.log('|---|---|---|---|---|---|');
rows.forEach((r, i) =>
  console.log(`| ${i + 1} | ${r.provider} | ${r.shape} | ${r.seconds} | $${r.perHr.toFixed(4)} | $${r.cost.toFixed(5)} |`),
);
