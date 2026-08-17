# Year 9 Study Hub 🚀

A self-contained, offline-first learning site for a UK Year 9 student. Six subjects —
Maths, Physics, Chemistry, Computing, History, Geography — each with topic lessons
(diagrams, worked examples, video links) and **unlimited randomised practice**. XP, levels,
badges and confetti-on-correct make it feel like a game.

Content matches the UK KS3 Year 9 programme of study plus GCSE Higher tier topics typically
covered in Year 9 at top academic schools. Maths stretches into UKMT competition
territory (IMC / Grey Kangaroo / Cayley Olympiad).

## What's inside

```
site/
├── index.html              # Main app (SPA, hash-routed, all 6 subjects)
├── dashboard.html          # Parent dashboard: XP, badges, activity, per-topic breakdown
├── README.md               # this file
└── assets/
    ├── style.css           # Full theme (light + dark, responsive, animations)
    ├── core.js             # Storage + answer marking utilities
    ├── gamify.js           # XP, 12 levels, 26 badges, confetti, level-up modal
    ├── svg.js              # SVG icon & diagram library
    ├── questions.js        # Maths generators (base Y8 set)
    ├── content.js          # Maths learning content (base set)
    ├── y9.js               # Maths Year 9 extensions (+13 topics, deeper generators)
    ├── physics.js          # Physics: 8 topics
    ├── chemistry.js        # Chemistry: 8 topics
    ├── computing.js        # Computing: 7 topics
    ├── history.js          # History: 8 topics
    ├── geography.js        # Geography: 8 topics
    ├── maths-visuals.js    # Attaches SVG diagrams to key maths topics
    └── app.js              # SPA controller + views + practice widget
```

Everything is static — no build step, no server. Just open `index.html`, or serve the folder.

## Running locally

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Hosting for free

Any static host works. Best options:

- **Cloudflare Pages** — drag-and-drop, fastest global CDN, unlimited bandwidth on free tier.
- **Netlify** — `netlify.com/drop`, no account needed.
- **GitHub Pages** — Settings → Pages → deploy from `/site`.
- **Vercel** — one-click from a Git repo.
- **Surge.sh** — `npx surge site/`.

## Topic coverage (70 topics · 158 generators · every canonical answer self-verifies)

### 📐 Mathematics — 31 topics
Number, Algebra, Geometry, Data, Competition. Full Year 9 (KS3 + GCSE Higher) plus IMC / Grey Kangaroo / Cayley Olympiad stretch. See earlier README revisions for full topic list.

### ⚛ Physics — 8 topics
Forces & Newton's laws · Motion (SUVAT) · Energy (KE, GPE, efficiency) · Electricity (V=IR, power) · Waves · Density & pressure · Magnetism · Space

### ⚗ Chemistry — 8 topics
Atomic structure · Periodic table · Bonding · Chemical reactions · Acids, bases & pH · Rates of reaction · Moles & Mr · Separation techniques

### `</>` Computing — 7 topics
Python basics · Algorithms · Boolean logic · Binary & hex · Hardware & storage · Networks & protocols · Cybersecurity

### 📜 History — 8 topics
Industrial Revolution · British Empire · Votes for women · First World War · Interwar & Weimar Germany · Second World War · The Holocaust · The Cold War

### 🌍 Geography — 8 topics
Tectonics · Weather & climate · Rivers · Coasts · Ecosystems & biomes · Population & migration · Urbanisation · Development

## Gamification

- **XP** — 10 per correct, +5 bonus every 5-streak, +15 for the first correct on a new topic, +25 daily bonus, +2 for a wrong-but-attempted answer.
- **Levels** — 🌱 Curious Beginner (0) → 💎 Maths Olympian (25,000). 12 titles.
- **Badges** — 26 to unlock. Streaks (🔥), milestones (💯), habits (📅), mastery (🥇), exploration (🧭), and a few fun ones (🦉 Night Owl, 🐦 Early Bird).
- **Coins** — 🪙 1 per correct + 10 per daily bonus. Bragging rights only, for now.
- **Confetti** on every correct answer. Level-up modal with animation. Badge toasts.

## How progress works

Progress lives in `localStorage` on each device **and** in a shared Cloudflare KV
store, so the parent dashboard on one device shows Ishaan's activity from another
device within ~5 seconds.

- The practice pages **push** state to the Worker after every answered question
  (debounced 600ms).
- The dashboard **pulls** state every 5 seconds.
- If the network is down, the site keeps working — the next successful push wins.
- If you never set up the sync (no `sync-config.js`), everything falls back to
  local-only mode and you can move progress between devices using the dashboard's
  Download / Import backup buttons.

## Cross-device sync setup (Cloudflare)

One-time. See `worker/README.md` for full commands.

1. **Deploy the Worker**
   ```bash
   cd worker
   npx wrangler login
   npx wrangler kv namespace create STUDY_HUB   # paste id into wrangler.toml
   openssl rand -hex 32                          # copy this token
   npx wrangler secret put SYNC_TOKEN            # paste the token
   npx wrangler deploy                           # note the worker URL
   ```

2. **Host the site on Cloudflare Pages**
   - Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git**
   - Pick `goyalvinod/year-9-study-hub`
   - Build command: `bash site/build.sh`
   - Build output directory: `site`
   - Environment variables (Production **and** Preview):
     - `WORKER_URL` = the URL from `wrangler deploy`
     - `SYNC_TOKEN` = the token from step 1
   - Deploy. Bookmark `https://year-9-study-hub.pages.dev/` (kid) and
     `https://year-9-study-hub.pages.dev/dashboard.html` (parent).

3. **Verify**
   Open the site on your phone, answer a question. Within ~5s the number on the
   dashboard on your laptop should tick up — no refresh needed. There's a
   "last update Xs ago" indicator under the title on the dashboard.

## Running locally

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

If you want the local site to sync too, copy `assets/sync-config.example.js` to
`assets/sync-config.js` and fill in the real values. That file is git-ignored.

## Extending

Each subject file follows the same shape — 1 generator array + 1 content object per topic,
registered into `window.Questions` and `window.Content.<SUBJECT>`. Copy any of `physics.js`,
`chemistry.js`, etc. as a template for a new subject or new topics within a subject.
