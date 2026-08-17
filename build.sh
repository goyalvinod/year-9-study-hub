#!/usr/bin/env bash
#
# Cloudflare Pages build step.
# Generates assets/sync-config.js from environment variables so the
# real bearer token stays out of git.
#
# Configure these in the Pages project → Settings → Environment variables:
#   WORKER_URL   e.g. https://study-hub-sync.<your-subdomain>.workers.dev
#   SYNC_TOKEN   the same bearer token you set with `wrangler secret put SYNC_TOKEN`
#   SYNC_USER    (optional) defaults to "ishaan"
#
# Pages runs this from the repo root (or wherever you set "Build command").

set -euo pipefail

USER_ID="${SYNC_USER:-ishaan}"

: "${WORKER_URL:?WORKER_URL env var is required}"
: "${SYNC_TOKEN:?SYNC_TOKEN env var is required}"

cat > site/assets/sync-config.js <<EOF
/* Generated at build time — do not commit. */
window.SYNC_CONFIG = {
  url: "${WORKER_URL}",
  token: "${SYNC_TOKEN}",
  user: "${USER_ID}"
};
EOF

echo "Wrote site/assets/sync-config.js for user=${USER_ID} url=${WORKER_URL}"
