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

Everything lives in `localStorage` on this device.

- Each device (laptop, phone, tablet) will have its own separate progress unless you sync.
- Use the **Parent dashboard** → **Download backup** to export a JSON snapshot.
- Import the same JSON on another device to sync.

If you later want automatic cross-device sync, a Cloudflare Worker + D1 (or Supabase) can add a
tiny sync API on the free tier.

## Extending

Each subject file follows the same shape — 1 generator array + 1 content object per topic,
registered into `window.Questions` and `window.Content.<SUBJECT>`. Copy any of `physics.js`,
`chemistry.js`, etc. as a template for a new subject or new topics within a subject.
