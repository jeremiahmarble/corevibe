# Architecture rules

## Security
- Frontend must never contain real API keys, secrets, tokens, or provider credentials.
- Frontend may only call the backend via HTTP.
- All provider credentials must be read on the backend from environment variables.

## Backend design
- Route handlers must stay thin.
- Route handlers should only: validate request, call pipeline/service layer, return normalized response.
- Business logic must not live directly inside Express route files.

## AI provider structure
- All Azure AI Foundry provider calls must live in:
  - `backend/src/providers/azureFoundry.js`
- No direct provider SDK calls anywhere else unless explicitly approved.

## Prompt loading
- System prompt must be loaded from a file.
- Do not hardcode long system prompts in JS files.
- Prompt files should live in:
  - `backend/prompts/`

## Logging
- Logs must exist at each major step:
  - request received
  - pre-processing start/end
  - system prompt load
  - provider call start/end
  - post-processing start/end
  - response sent
  - error paths

## Database
- No database code unless intentionally stubbed.
- If future DB work is needed, use a clearly named stub file or TODO section.
- Do not add ORM, migrations, models, or database packages unless explicitly requested.

## Preferred backend flow
frontend chat -> backend route -> pre-processing -> prompt loader -> provider -> post-processing -> normalized response