#!/usr/bin/env bash
# Rebuilds results/sandbox-dax/latest.json and dax.svg the way the weekly
# workflow's collect job does: every provider's latest.json goes into one
# artifacts dir and benchmarks/src/merge-results.ts merges them. The other
# providers come unchanged from upstream's 2026-10-30 run (commit 95872ada);
# the Agent37 rows come from docs/agent37/raw/.
set -euo pipefail
cd "$(dirname "$0")/../.."
in="$(mktemp -d)"
mkdir -p "$in/results-upstream-2026-10-30/sandbox-dax"
git show 95872adae52cc5a759929988b955a80cd96f87ef:results/sandbox-dax/latest.json \
  > "$in/results-upstream-2026-10-30/sandbox-dax/latest.json"
cp -R docs/agent37/raw/. "$in/"
npx tsx benchmarks/src/merge-results.ts --input "$in"
pnpm run generate-dax-svg
