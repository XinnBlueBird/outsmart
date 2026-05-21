<div align="center">

<img src="public/logo.svg" alt="OUTSMART" width="280" />

<br />

**Human vs AI Intelligence Arena — Powered by MiMo v2.5 Pro**

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![MiMo](https://img.shields.io/badge/AI-MiMo_v2.5_Pro-A78BFA?style=flat-square)](https://xiaomimimo.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## The Premise

You enter a testing facility to face MiMo — an advanced reasoning AI that gets smarter every round. Four arenas. Each tests a different dimension of intelligence. Complete them all to conquer **The Gauntlet**.

Every move MiMo makes is transparent. Watch its reasoning chain in real-time as it tries to outthink you.

## The Arenas

<table>
<tr>
<td width="50%">

### Arena 1 — Cipher Vault
Decrypt codes. Crack patterns. Solve logic puzzles. Caesar ciphers, number sequences, riddles, and more. MiMo crafts challenges adapted to your skill level.

</td>
<td width="50%">

### Arena 2 — The Interrogation
Three suspects. One is an AI masquerading as human. Ask questions, read between the lines, and identify the impostor. MiMo deploys subtle deception tactics.

</td>
</tr>
<tr>
<td>

### Arena 3 — The Negotiation
Hidden objectives. Bluff. Trade. Betray. Engage in strategic resource negotiations where MiMo tests your ability to read subtext and call out deception.

</td>
<td>

### Arena 4 — The Final Duel
Anything goes. Riddles, wordplay, lateral thinking, creative constraints, ethical dilemmas. MiMo adapts to your playstyle in real-time. No patterns. No mercy.

</td>
</tr>
</table>

## Features

- **Live AI Reasoning** — Watch MiMo's thinking chain stream in real-time as it formulates challenges and evaluates your responses
- **Adaptive Difficulty** — MiMo learns from your performance. Score well and the challenges escalate
- **Score Tracking** — Points accumulate across rounds within each arena. High scores unlock harder difficulty tiers
- **Private Mempool** — No, wait, that's the other project. This one's just pure brain vs brain
- **Four Distinct Game Modes** — Each arena has unique mechanics, prompts, and scoring systems
- **Dark Futuristic UI** — Premium glass-morphic design with violet accent, grid patterns, and ambient glow effects

## Architecture

```
src/
  app/
    api/mimo/route.ts        # MiMo v2.5 Pro SSE streaming proxy (edge runtime)
    arena/
      cipher/page.tsx         # Arena 1: Cipher puzzles
      interrogate/page.tsx    # Arena 2: Social deduction
      negotiate/page.tsx      # Arena 3: Strategic negotiation
      duel/page.tsx           # Arena 4: Anything-goes duel
    layout.tsx                # Root layout + metadata
    page.tsx                  # Landing page + arena selection
    globals.css               # Dark theme tokens + animations
  components/
    ArenaLayout.tsx           # Shared arena shell (nav, score, game states)
    AIThinking.tsx            # Live reasoning chain display
  lib/
    game-engine.ts            # Core game loop: rounds, scoring, state machine
    mimo-client.ts            # SSE streaming client with MiMo reasoning_content support
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (static export) |
| UI | React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Animations | Framer Motion |
| AI Engine | MiMo v2.5 Pro (Xiaomi) |
| Streaming | SSE via Edge Runtime |
| Deployment | Vercel |

## Getting Started

```bash
git clone https://github.com/XinnBlueBird/outsmart.git
cd outsmart
npm install
cp .env.example .env.local
# Edit .env.local with your MiMo API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter The Gauntlet.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MIMO_API_KEY` | Yes | MiMo v2.5 Pro API key |
| `MIMO_BASE_URL` | No | API endpoint (default: Token Plan SGP) |
| `MIMO_MODEL` | No | Model name (default: `mimo-v2.5-pro`) |

## How the AI Works

Each arena has a specialized system prompt that controls MiMo's behavior:

- **Cipher** — Generates progressive-difficulty puzzles, evaluates answers with `[SCORE: N]` tags
- **Interrogation** — Creates NPC personas, one subtly AI-like, generates contextual responses to questions
- **Negotiation** — Manages resource scenarios with hidden objectives, bluffs, and counter-offers
- **Duel** — Rotates challenge types (riddles, wordplay, lateral thinking, creative constraints), adapts to player strengths

The game engine parses MiMo's structured responses for score extraction and state transitions.

## Scoring System

| Outcome | Points |
|---------|--------|
| Brilliant / Perfect | +5 |
| Correct / Good deal | +3 |
| Partial / Break-even | +1 |
| Wrong / Bluffed | 0 |

Difficulty scales with performance. Three perfect rounds in a row triggers maximum difficulty.

## Deployment

```bash
npm run build    # Static export to out/
```

Deploy to Vercel, Netlify, or any static host. The `/api/mimo` route requires an edge-capable host for SSE streaming.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/XinnBlueBird/outsmart)

## License

MIT

---

<div align="center">

**Built to showcase MiMo v2.5 Pro reasoning capabilities**

*Can you outsmart the machine?*

</div>
