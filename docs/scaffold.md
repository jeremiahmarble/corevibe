
AI App Scaffolding Specification

1. Purpose
This document defines a reusable starter scaffold for AI web apps. The goal is to create a bare-bones but extensible foundation that can be reused across future AI projects rather than starting from scratch each time.

This scaffold is designed to support:
A React chat frontend
An Express backend
A pre-processing stub for prompt checks and Responsible AI checks
System prompt injection, initially loaded from a file
Model selection at request time
A post-processing stub for response checks and Responsible AI checks
Structured logging across each step of the request lifecycle
Backend-only model keys and provider credentials
This scaffold is intentionally minimal for v1, while leaving clear extension points for:
memory
tools
evals
auth
billing
persistence
multi-provider orchestration

2. Architecture
The app should be built as a single repo with one React frontend and one Express backend.
The backend should be explicitly designed around an AI request pipeline:
`frontend chat -> backend route -> pre-processing stub -> system prompt injection -> model adapter -> post-processing stub -> normalized response -> frontend`

Request flow
The user types a message into the chat UI.
The frontend sends a request to `POST /api/chat`.
The backend logs request start.
The backend runs a pre-processing stub.
The backend loads a system prompt from `prompts/system.txt`.
The backend selects and calls the requested model provider.
The backend runs a post-processing stub.
The backend logs the result and returns a normalized response.
The frontend renders the assistant response in the chat window.
Design principles
Keep the frontend thin.
Keep provider credentials on the backend only.
Keep route handlers thin and move AI logic into services and provider adapters.
Normalize provider outputs so the frontend does not need provider-specific logic.
Make logging, pre-processing, and post-processing part of the default scaffold rather than optional future enhancements.
Keep the database optional for v1.

Considerations

Summary:
Decoupled folders (frontend & backend), one Express app that owns the API and (in prod) the built React app, env-based config, JS-first React with optional TS in shared UI, Postgres/Sequelize on the server.
Repo shape
• Single repo with two deployable halves: frontend/ and backend/, plus a root package.json that wires install/build/start (e.g. build the SPA, run the API).
• Environment: one .env at the repo root; the backend loads it with dotenv (and dev scripts also use Node’s --env-file where configured). API keys, DB URLs, and third-party secrets live there—not hardcoded.
Frontend
• React SPA, Vite as the dev server and bundler, entry at frontend/src/main.jsx → App.jsx.
• React Router for client-side routes; TanStack React Query for server state.
• Tailwind CSS + Radix-style / shadcn-style UI primitives (frontend/src/components/ui/).
• .jsx pages and wiring
Backend
• Node.js (ES modules: "type": "module"), Express HTTP server (backend/server.js).
• PostgreSQL via Sequelize (models + migrations; DB URL from env, e.g. dev/test/prod variants).
• Route modules under backend/routes/ (auth, billing, content, health, etc.), middleware (auth, payments), services for domain logic.
• Auth: JWT + cookies (e.g. jsonwebtoken, cookie-parser).
• Integrations (examples from dependencies): OpenAI, Stripe, email (Nodemailer), etc.—all driven by env vars.

How front and back connect
• Development: Vite proxies paths like /api, /auth, /health, … to http://localhost:3000 (the Express app).
• Test/Production: Express serves the built SPA from frontend/dist and falls back to index.html for client routing (classic “API + static SPA on one origin”).

Scaffolding checklist for “the next project like this”
1. Root: scripts to npm install in backend / frontend, build the frontend, start the backend.
2. frontend/: Vite + React + Router + Tailwind; optional React Query; vite.config proxy to the API port.
3. backend/: Express ESM entry, dotenv loading root .env, routes/ + middleware/ + models/ (or a thinner folder set if you skip DB at first).
4. .env: all secrets and environment-specific URLs; never commit real values.
5. Database (if you need it): Postgres + an ORM + migrations from day one or add when you outgrow JSON/files.


3. Repo structure
Use the following folder shape:
```text
corevibe/
  package.json
  .gitignore
  README.md
  scaffold.md
  prompts/
    system.txt

  frontend/
    package.json
    .env.example
    src/
      main.jsx
      App.jsx
      api/
        client.js
      components/
        ChatWindow.jsx
        MessageList.jsx
        MessageInput.jsx
        ModelSelector.jsx

  backend/
    package.json
    .env.example
    server.js
    app.js
    config/
      env.js
    routes/
      health.js
      chat.js
    controllers/
      chatController.js
    services/
      chatService.js
    pipeline/
      preProcess.js
      loadSystemPrompt.js
      postProcess.js
    providers/
      azureFoundry.js
      openai.js
      anthropic.js
      gemini.js
      groq.js
      index.js
    logging/
      logger.js
      requestLogger.js
    middleware/
      errorHandler.js
    utils/
      normalizeResponse.js
```
Notes on structure
`frontend/` contains the user-facing chat application.
`backend/` contains the API, AI pipeline, provider adapters, and logging.
`prompts/system.txt` stores the initial system prompt outside application code.
`providers/` isolates provider-specific logic.
`pipeline/` contains pre-processing, prompt augmentation, and post-processing steps.
`logging/` contains centralized logging configuration and request logging middleware.

4. API contract
The frontend should communicate with the backend through a single normalized chat endpoint for v1.
Request shape
```json
{
  "provider": "azure-foundry",
  "model": "gpt-4.1-mini",
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```
Response shape
```json
{
  "provider": "azure-foundry",
  "model": "gpt-4.1-mini",
  "outputText": "Hello. How can I help?",
  "meta": {
    "preProcessing": "passed",
    "postProcessing": "passed"
  }
}
```
Endpoint list for v1
`GET /api/health`
`POST /api/chat`
All other route families should be deferred until later phases.

5. Logging requirements
Structured logging is required from day one.
The scaffold must log the following events:
request start
pre-processing start
pre-processing end
system prompt load
provider selected
model call start
model call end
post-processing start
post-processing end
response returned
error

Logging goals
Logs should make it easy to answer:
what request happened
which provider was selected
which model was used
whether pre-processing passed
whether post-processing passed
how long the model call took
whether the request succeeded or failed
Logging rules
Use structured logs rather than scattered `console.log` statements.
Do not log secrets.
Do not log provider keys.
Do not log cookies or auth tokens.
Do not log full prompt/response bodies by default in production.
Log request IDs so events can be correlated across the full request lifecycle.

6. Environment strategy
Move away from a single shared root `.env` for the app runtime.
Requirements
Frontend env contains only safe `VITE_` values.
Backend env contains provider keys and endpoints.
Do not expose provider keys in frontend code.
Use `.env.example` files in git.
Never commit real secrets.
Frontend env example
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=CoreVibe
```
Backend env example
```bash
PORT=3000
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info

AZURE_FOUNDRY_ENDPOINT=
AZURE_FOUNDRY_API_KEY=
AZURE_FOUNDRY_MODEL=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
```
Why this change matters
Using separate frontend and backend env files reduces the risk of accidentally bundling secrets into the browser build. Frontend variables should only include values that are safe to expose publicly. Provider credentials must remain server-side.

7. AI request pipeline
This section is a required addition to the scaffold.
The backend must treat model invocation as a pipeline rather than a direct call from a route handler.

Pipeline steps
Receive normalized request from frontend.
Log request start.
Run `preProcess.js`.
Load system prompt from `prompts/system.txt` via `loadSystemPrompt.js`.
Merge system prompt with user messages into a provider-ready payload.
Select provider adapter through `providers/index.js`.
Call the provider adapter.
Normalize provider response.
Run `postProcess.js`.
Log completion.
Return normalized response to frontend.

Pipeline responsibilities

Pre-processing stub
Purpose:
validate request shape
check for empty prompts
create placeholder hooks for future RAI logic

Initial v1 behavior can be simple:
message exists
message content is not empty
optional length check
return pass/fail metadata

System prompt loader
Purpose:
load `prompts/system.txt`
keep system prompt editable outside code
support future prompt versioning

Provider adapter
Purpose:
translate normalized internal request into provider-specific request shape
call selected provider
translate provider-specific response into normalized response shape

Post-processing stub
Purpose:
validate output exists
create placeholder hooks for future RAI or output policy checks
attach status metadata to the response

8. Provider adapters
Provider integrations must not be called directly from route handlers.
All provider-specific logic should live under `backend/providers/`.
Required adapters
`azureFoundry.js`
`openai.js`
`anthropic.js`
`gemini.js`
`groq.js`
`index.js`

Provider adapter rules
Route handlers should not contain provider-specific request code.
Route handlers should not contain provider-specific endpoint logic.
A shared interface should be used so the service layer can call any provider consistently.
Provider output must be normalized before returning to the frontend.

v1 provider scope
For Phase 1, only Azure Foundry needs to be fully implemented.
The other provider files can exist as stubs or placeholders so the scaffold is ready for future extension.

9. Database strategy
The database should be optional for v1.
Do not make Postgres or Sequelize part of the required initial app path.
Rationale
For a bare-bones chat scaffold, adding a database immediately introduces unnecessary friction. Persistence can be added later once the app needs:
user accounts
chat history
analytics storage
long-term memory
eval tracking
billing records
v1 rule
No database is required for the first working version.
Future option
If persistence is later needed, add:
Postgres
Sequelize or another ORM
migrations
environment-specific DB URLs

10. Build phases
Implementation should be broken into clear phases.


Phase 1: working Azure Foundry chat app
Deliver a working app with:
React frontend chat UI
Express backend
`GET /api/health`
`POST /api/chat`
logging for each step
pre-processing stub
system prompt loading from file
Azure Foundry provider adapter
post-processing stub
normalized backend response


Phase 2: add provider adapters
Extend the scaffold to support:
OpenAI
Claude / Anthropic
Gemini
Groq
Maintain the same normalized request and response contract.


Phase 3: optional expansion
Optionally add:
database
auth
memory
evals
billing
additional orchestration logic


11. Out of scope for v1
The following are explicitly out of scope for the first version:
auth
billing
persistence
streaming
tool calling
multi-user memory
file upload
These capabilities can be layered on after the core request pipeline is running.


The following changes should be made before handing this scaffold to Cursor:
Replace the assumption of a single shared root `.env` with separate frontend and backend `.env.example` files.
Change the database from a default assumption to an optional later addition.
Add an explicit AI request pipeline section.
Make logging, pre-processing, and post-processing part of the default scaffold.
Add provider adapters as a first-class architectural concept.
Trim the v1 route surface to:
`GET /api/health`
`POST /api/chat`
Move all other concerns into future phases.
12. Cursor implementation guidance
When using this file with Cursor, instruct Cursor to:
read this file first
build Phase 1 only before attempting later phases
implement Azure Foundry first
create the provider adapter files for future expansion
keep frontend and backend concerns separated
avoid adding database, auth, or billing in v1
keep the chat UI bare-bones and classic
wire logging across every pipeline stage
use the system prompt file rather than hardcoding the prompt in application logic

13. Success criteria for v1
The scaffold is successful when:
the frontend loads a working chat UI
the backend responds to `GET /api/health`
the frontend can send a user message to `POST /api/chat`
the backend runs pre-processing
the backend loads a system prompt from file
the backend calls Azure Foundry successfully
the backend runs post-processing
the backend returns a normalized response
the frontend renders the assistant response
logging exists for each major step