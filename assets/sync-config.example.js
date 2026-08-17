/*
 * Copy this file to sync-config.js and fill in real values.
 * DO NOT COMMIT the real sync-config.js — the token is a shared password.
 *
 * On Cloudflare Pages, build.sh generates sync-config.js at deploy time
 * from the WORKER_URL and SYNC_TOKEN environment variables, so this
 * example file stays as-is in the repo.
 */
window.SYNC_CONFIG = {
  url: "https://study-hub-sync.YOUR-SUBDOMAIN.workers.dev",
  token: "REPLACE_WITH_LONG_RANDOM_TOKEN",
  user: "ishaan"
};
