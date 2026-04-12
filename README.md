# CoreVibe

Monorepo starter for a minimal AI chat app: a **Vite + React** frontend and an **Express** backend with a structured chat pipeline, logging, and an **Azure Foundry** (Azure OpenAI–compatible) adapter. See [docs/scaffold.md](docs/scaffold.md) for the full scaffolding specification and later phases.

**Phase 1 scope:** chat UI, `GET /api/health`, `POST /api/chat`, file-based system prompt, pre/post processing stubs, structured logs, no auth, database, billing, or streaming.

## Requirements

- [Node.js](https://nodejs.org/) 18+ (includes `fetch` for the backend)

## Quick start

1. **Environment**

   - Copy [backend/.env.example](backend/.env.example) to `backend/.env` and set Azure variables (and optional `PORT`, `CORS_ORIGIN`, `LOG_LEVEL`).
   - Copy [frontend/.env.example](frontend/.env.example) to `frontend/.env` if you want to override defaults (`VITE_API_BASE_URL`, `VITE_APP_NAME`, `VITE_DEFAULT_MODEL`).

   Provider keys and endpoints must stay in **`backend/.env` only**. The frontend only uses `VITE_*` values (safe to expose in the browser).

2. **Install dependencies** (from the repo root):

   ```bash
   npm run install:all
   ```

3. **Development** (API and Vite dev server together):

   ```bash
   npm run dev
   ```

   - Frontend: [http://localhost:5173](http://localhost:5173) (proxies `/api` to the backend).
   - Backend: [http://localhost:3000](http://localhost:3000) by default.

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run install:all` | Install root, `frontend/`, and `backend/` dependencies |
| `npm run dev` | Run backend and frontend watch processes in parallel |
| `npm run build` | Production build of the frontend to `frontend/dist` |
| `npm start` | Start the backend only (`node server.js` in `backend/`) |

For production you typically build the frontend, deploy `frontend/dist` as static assets, and run the API with `CORS_ORIGIN` pointing at that origin. Serving the SPA from Express is optional and not wired in Phase 1.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Liveness check (`{ "ok": true }`) |
| `POST` | `/api/chat` | Chat completion; body matches the normalized contract in [docs/scaffold.md](docs/scaffold.md) (`provider`, `model`, `messages`) |

## Repository layout

- [frontend/](frontend/) — React app (Vite), bare-bones chat UI
- [backend/](backend/) — Express app, pipeline, providers, logging
- [prompts/system.txt](prompts/system.txt) — System prompt loaded on each chat request (edit without changing code)

## Azure configuration

Set `AZURE_FOUNDRY_ENDPOINT` to either:

- The **resource base** (e.g. `https://YOUR_RESOURCE.openai.azure.com`), with the deployment name in `AZURE_FOUNDRY_MODEL` or the `model` field from the client, or  
- A **full** `chat/completions` URL if your portal gives one (including `api-version` if required).

Use `AZURE_FOUNDRY_API_KEY` for the `api-key` header. Details and placeholders are in [backend/.env.example](backend/.env.example).
