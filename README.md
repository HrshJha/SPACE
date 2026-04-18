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
2. Set `VITE_COSMOS7_ENDPOINT`.
3. For the best free local path, use Ollama:

```bash
ollama pull qwen2.5:7b-instruct
```

4. Keep `COSMOS7_PROVIDER=auto` or set `COSMOS7_PROVIDER=ollama`.
5. Run the frontend and backend in separate terminals:

```bash
npm run dev
npm run cosmos7
```

The backend exposes `POST /api/cosmos7` from `server/cosmos7-server.mjs`.

### Providers

- `ollama`:
  Free and local. Default model is `qwen2.5:7b-instruct`, which is a strong balance of quality and speed for COSMOS-7.
- `anthropic`:
  Optional remote provider if you already have credentials.
- `fallback`:
  Static onboard answers only.

In `auto` mode, COSMOS-7 will try Ollama first, then Anthropic if configured, and otherwise fall back gracefully.

## Quality checks

```bash
npm run lint
npm run build
```
