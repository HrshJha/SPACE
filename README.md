# Where The Universe Lives

A cinematic astrophysics experience built with React, Vite, Tailwind, React Three Fiber, GSAP, Lenis, Zustand, and shader-driven background systems.

## Run

```bash
npm install
npm run dev
```

## Optional COSMOS-7 backend

The UI works without a backend and falls back to onboard local answers. To enable live COSMOS-7 responses:

1. Copy `.env.example` to `.env`.
2. Set `VITE_COSMOS7_ENDPOINT`, `ANTHROPIC_API_KEY`, and `ANTHROPIC_MODEL`.
3. Run the frontend and backend in separate terminals:

```bash
npm run dev
npm run cosmos7
```

The backend exposes `POST /api/cosmos7` from `server/cosmos7-server.mjs`.

## Quality checks

```bash
npm run lint
npm run build
```
