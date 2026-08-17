# study-hub-sync (Cloudflare Worker)

Tiny Worker that stores Ishaan's progress in Cloudflare KV so it syncs across devices.

## One-time setup

```bash
cd worker

# 1. Log in to Cloudflare (opens browser)
npx wrangler login

# 2. Create the KV namespace and paste the returned id into wrangler.toml (replace REPLACE_WITH_KV_NAMESPACE_ID)
npx wrangler kv namespace create STUDY_HUB

# 3. Generate a shared secret token and copy it somewhere safe (you need it twice)
openssl rand -hex 32

# 4. Store the token as a Worker secret (paste the value when prompted)
npx wrangler secret put SYNC_TOKEN

# 5. Deploy
npx wrangler deploy
```

Wrangler prints the Worker's public URL, e.g.
`https://study-hub-sync.<your-subdomain>.workers.dev`.

## Test with curl

```bash
TOKEN=<the token from step 3>
URL=<your worker URL>

# Read (empty first time)
curl -H "Authorization: Bearer $TOKEN" "$URL/state?u=ishaan"

# Write
curl -X PUT -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"version":2,"topics":{},"daily":{},"global":{}}' \
  "$URL/state?u=ishaan"

# Read again — should return the state
curl -H "Authorization: Bearer $TOKEN" "$URL/state?u=ishaan"
```

## What it exposes

| Method | Path | Description |
|---|---|---|
| `GET` | `/state?u=<user>` | Read stored state |
| `PUT` | `/state?u=<user>` | Overwrite stored state |
| `OPTIONS` | `*` | CORS preflight |

Authorisation is a shared bearer token in the `Authorization: Bearer …` header.
Payloads over 512 KB are rejected.

## Costs

Cloudflare's free tier covers ~100k Worker requests per day and 1 GB of KV storage.
This app makes ~1 request per answered question plus 1 poll every 5 seconds from
the dashboard — nowhere near the limit.
