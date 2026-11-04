# Agent37 on the ComputeSDK benchmarks

Copy of [computesdk/benchmarks](https://github.com/computesdk/benchmarks) at upstream `a89331e9` (2026-11-02), with Agent37 added and measured on 2026-11-03 with their own harness. Nothing here was sent upstream.

**Where we lead**

- **Pricing board: #1 of 10.** $0.0060/hr for our smallest shape (2 vCPU / 4 GB) against $0.0088 for the next one (Blaxel, and that is their 10%-CPU estimate).
- **Cost per Dax build (derived from their own two datasets): #1, #2 and #3 of 8.** A full build costs $0.0010 on a default sandbox, against $0.0098 on Blaxel and $0.0140 on E2B.
- **Dax build speed: we do not lead.** Performance #13 of 21, VM #14 of 21, default #20 of 21, all on 4 vCPU against 8 vCPU for most of the field.

Agent37 rows: `agent37` = default sandbox, `agent37-vm` = `type: "vm"`, `agent37-performance` = `type: "performance"`. Every row is 4 vCPU / 16 GB, our largest CPU count.

## Boards that exist

| Board | Where | Agent37 |
|---|---|---|
| Burst TTI (sandboxes) | site + `burst_tti.svg` | not run (startup speed, left out on purpose) |
| Dax build workload (sandboxes) | site + `dax.svg` | run |
| Pricing comparison | repo README + `pricing.svg` (not on the site) | added |
| Storage lifecycle 1/4/10/16 MB, Snapshot & fork | site | n/a, object storage |
| Browser sessions, Browser throughput | site | n/a, hosted browser APIs |
| AI gateway (Anthropic, OpenAI, Gemini, Kimi, model index) | site | n/a |

Nothing new since 2026-10-25: no CPU, filesystem or build board was added. Upstream added a "reliability" benchmark type to the platform (only a Tensorlake OpenCode check uses it, with no published results), removed Declaw, and published a new weekly Dax run on 2026-10-30. Sequential and staggered TTI are retired.

## Pricing (`pricing.svg`, `pricing.json`)

Their script, their formula: cost for 1 vCPU + 2 GB per hour, using the smallest shape a provider sells. Active-CPU providers (~) are their estimate at 10% CPU; Agent37 is billed for the full time the sandbox runs.

| Rank | Provider | $/hr |
|---|---|---|
| 1 | **Agent37** | $0.0060 |
| 2 | Blaxel | ~$0.0088 |
| 3 | **Agent37 VM** | $0.0151 |
| 4 | **Agent37 Performance** | $0.0241 |
| 5 | Cloudflare | ~$0.0252 |
| 6 | Vercel | ~$0.0340 |
| 7 | Modal | ~$0.0661 |
| 8 | CodeSandbox | $0.0743 |
| 9 | E2B | $0.0828 |
| 9 | Hopx | $0.0828 |
| 9 | Daytona | $0.0828 |
| 12 | Runloop | $0.1584 |

Against the 9 other providers alone: default #1, VM #2, Performance #2 (of 10 each). At full CPU use (their `total_1vcpu_2gb_hr`), all three are cheaper than everyone listed.

## Dax build (`dax.svg`, `results/sandbox-dax/latest.json`)

Clone, install and typecheck the OpenCode repo (pinned commit) in a fresh sandbox. Other providers are their 2026-10-30 weekly run, unchanged (one build each). Ours are 5 builds each, median of the successful ones. 13 more providers in their run did not finish a build and are left out of the ranking.

| Rank | Provider | Median build | Builds OK | Shape seen in sandbox |
|---|---|---|---|---|
| 1 | isorun | 36.1 s | 1/1 | 8 vCPU / 16 GB |
| 2 | promigence | 36.2 s | 1/1 | 8 vCPU / 32 GB |
| 3 | namespace | 46.2 s | 1/1 | 8 vCPU / 16 GB |
| 4 | blaxel | 53.0 s | 1/1 | 8 vCPU / 16 GB |
| 5 | createos | 53.2 s | 1/1 | 8 vCPU / 16 GB |
| 6 | upstash | 57.3 s | 1/1 | 48 vCPU / 185 GB |
| 7 | mosaic | 58.6 s | 1/1 | 8 vCPU / 16 GB |
| 8 | gravixlayer | 58.7 s | 1/1 | 8 vCPU / 16 GB |
| 9 | buddy | 59.1 s | 1/1 | 8 vCPU / 16 GB |
| 10 | tenki | 60.8 s | 1/1 | 8 vCPU / 16 GB |
| 11 | superserve | 64.3 s | 1/1 | 8 vCPU / 16 GB |
| 12 | arker | 64.7 s | 1/1 | 8 vCPU / 16 GB |
| 13 | **agent37-performance** | 67.1 s | 3/5 | 4 vCPU / 16 GB |
| 14 | sail | 67.3 s | 1/1 | 8 vCPU / 16 GB |
| 15 | **agent37-vm** | 67.5 s | 5/5 | 4 vCPU / 16 GB |
| 16 | e2b | 75.9 s | 1/1 | 8 vCPU / 16 GB |
| 17 | novita | 81.1 s | 1/1 | 8 vCPU / 16 GB |
| 18 | vercel | 83.4 s | 1/1 | 8 vCPU / 16 GB |
| 19 | beam | 96.1 s | 1/1 | 64 vCPU / 16 GB |
| 20 | modal | 105.5 s | 1/1 | 4 vCPU / 329 GB |
| 21 | sandbox0 | 125.0 s | 1/1 | 8 vCPU / 16 GB |
| 22 | **agent37** | 133.5 s | 4/5 | 4 vCPU / 16 GB |
| 23 | cloudflare | 189.9 s | 1/1 | 8 vCPU / 16 GB |

Upstash, Beam and Modal show the host's CPUs or RAM rather than their limit; every other provider was asked for 8 vCPU / 16 GB (Promigence's closest size has 32 GB).

Each type against the 20 other finishers alone: Performance #13, VM #14, default #20 (of 21).

## Cost per Dax build (derived, not one of their boards)

`docs/agent37/cost-per-build.ts`: median build time from the Dax board times each provider's `pricing.json` rate at the shape it ran, full rate (a build keeps the CPU busy). Agent37 is rounded up to whole minutes, since we bill by the started minute. Only providers in both files with a finished build.

| Rank | Provider | Build | $/hr at shape | $ per build |
|---|---|---|---|---|
| 1 | **agent37** | 133 s | $0.0197 | $0.00099 |
| 2 | **agent37-vm** | 68 s | $0.0493 | $0.00164 |
| 3 | **agent37-performance** | 67 s | $0.0789 | $0.00263 |
| 4 | blaxel | 53 s | $0.6669 | $0.00981 |
| 5 | e2b | 76 s | $0.6624 | $0.01396 |
| 6 | vercel | 83 s | $1.1936 | $0.02764 |
| 7 | modal | 106 s | $0.9547 | $0.02799 |
| 8 | cloudflare | 190 s | $0.7200 | $0.03798 |

## What is not like-for-like

- **Half the cores.** The board asks for 8 vCPU / 16 GB; no Agent37 instance goes above 4 vCPU, so ours ran 4 vCPU / 16 GB.
- **Different days, different sample sizes.** Their rows are one build each from 2026-10-30, driven from their CI. Ours are five builds each from 2026-11-03, driven from a laptop. The timer wraps the in-sandbox command, so the driver only adds one API round trip.
- **One harness change.** `dax-legacy-results.ts` now takes the median over successful builds when there is one. Before, a failed build's partial time was averaged in and made a row look faster. Their single-build weekly rows come out the same either way.
- **Our failures, counted.** Performance lost 2 of 5 builds to the guest running out of memory during typecheck (`tsgo` got SIGKILL; a diagnostic rerun's `dmesg` shows the OOM killer); 16 GB is tight for this workload at 4 vCPU. One default build ran past 300 s on a shared host and hit the provider's 300 s fetch header timeout (see below).
- **Earlier attempts, excluded.** Between 12:03 and 12:14 UTC, 9 of 12 builds failed at install because `pkg.pr.new` (a third-party package host the OpenCode lockfile uses) answered bun with a 404; curl to the same URL from the same machines got 200, and it cleared up by itself. One more pass was stopped to apply the median fix (Performance 67.6 s, 71.6 s and one more OOM). The builds that finished in those attempts (default 116 s and 107 s; Performance 66.5, 67.6 and 71.6 s) agree with the published numbers.
- **Pricing mix.** Active-CPU competitors are priced at 10% CPU by their script, Agent37 at full time. The Performance 4x compute rate is not on agent37.com/pricing (VM 2.5x is).
- **Shared workspace.** Another benchmark session ran sandboxes in the same workspace during the final pass. A host log taken every 10 s shows none of our measured sandboxes on a host with one of theirs. Our builds ran one at a time; the one diagnostic VM ran during the default sandbox builds, on the separate VM fleet.

## Broken things found

- `@computesdk/agent37` (computesdk/computesdk#1013) uses Node `fetch` for exec, so any command that runs longer than 300 s fails with `UND_ERR_HEADERS_TIMEOUT`, whatever timeout the caller passed. The Dax deadline is 600 s.
- The Dax summary median counted failed builds (fixed here, above).
- `sandbox-capabilities.yml` runs `benchmarks/sandbox/capabilities.bench.ts`, which no longer exists.
- `packages/benchsdk-runner/README.md` says `bench run` needs platform auth even with `--no-ingest`. It does not: `--no-ingest` runs fine with no key.

## Reproduce

```bash
pnpm install --ignore-scripts && pnpm -r --filter './packages/**' run build
echo 'AGENT37_API_KEY=<sk_live key>' > benchmarks/.env

# One Agent37 type at a time, nothing else CPU-heavy of yours running on that runtime.
# bench run overwrites results/sandbox-dax/, so file its output, then restore it.
for p in agent37-performance agent37-vm agent37; do
  npx tsx packages/benchsdk-runner/dist/bin.js run benchmarks/sandbox/dax.bench.ts --provider $p --iterations 5 --no-ingest
  mkdir -p docs/agent37/raw/results-$p-sandbox-dax/sandbox-dax
  cp results/sandbox-dax/latest.json docs/agent37/raw/results-$p-sandbox-dax/sandbox-dax/latest.json
  git checkout -- results/sandbox-dax && git clean -fdq results/sandbox-dax
done

./docs/agent37/merge-dax.sh            # their merge-results.ts + generate-dax-svg over upstream's 2026-10-30 run plus raw/
pnpm run generate-pricing-svg
npx tsx docs/agent37/cost-per-build.ts
```

What changed against upstream: `packages/agent37` (provider vendored unchanged from #1013), `benchmarks/sandbox/providers.ts` and `dax.bench.ts` (the three Agent37 participants and their 4/16 shape), `pricing.json` (the #557 row plus VM and Performance rows), `dax-legacy-results.ts` (median fix), the Dax workflow matrix, and the regenerated `dax.svg`, `pricing.svg` and `results/sandbox-dax/`.
