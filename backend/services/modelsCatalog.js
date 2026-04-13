import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_PATH = path.join(__dirname, '..', 'config', 'models.json');

let cache = null;

function assertCatalogShape(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.providers)) {
    const err = new Error(
      'Models catalog must be a JSON object with a "providers" array. See backend/config/models.json.',
    );
    err.statusCode = 503;
    throw err;
  }
}

export async function getModelsCatalog() {
  if (!cache) {
    let raw;
    try {
      raw = await readFile(MODELS_PATH, 'utf8');
    } catch (e) {
      if (e && e.code === 'ENOENT') {
        const err = new Error(
          `Models catalog file not found at ${MODELS_PATH}. Add backend/config/models.json.`,
        );
        err.statusCode = 503;
        throw err;
      }
      const err = new Error(`Could not read models catalog: ${e.message}`);
      err.statusCode = 503;
      throw err;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      const err = new Error(
        'Invalid JSON in backend/config/models.json (check commas, brackets, and quotes).',
      );
      err.statusCode = 503;
      err.cause = e;
      throw err;
    }

    assertCatalogShape(data);
    cache = data;
  }
  return cache;
}

/**
 * @param {unknown} catalog
 * @param {string} providerId
 * @param {string} modelId
 */
export function assertValidModelSelection(catalog, providerId, modelId) {
  if (typeof providerId !== 'string' || !providerId.trim()) {
    const err = new Error('provider is required');
    err.statusCode = 400;
    throw err;
  }
  if (typeof modelId !== 'string' || !modelId.trim()) {
    const err = new Error('model is required');
    err.statusCode = 400;
    throw err;
  }

  const providers = catalog?.providers;
  if (!Array.isArray(providers)) {
    const err = new Error('Models catalog is invalid');
    err.statusCode = 500;
    throw err;
  }

  const p = providers.find((x) => x && x.id === providerId);
  if (!p) {
    const err = new Error(`Unknown provider: ${providerId}`);
    err.statusCode = 400;
    throw err;
  }

  const models = p.models;
  if (!Array.isArray(models) || !models.some((m) => m && m.id === modelId)) {
    const err = new Error(`Unknown model "${modelId}" for provider "${providerId}"`);
    err.statusCode = 400;
    throw err;
  }
}
