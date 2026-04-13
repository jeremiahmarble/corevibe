import { getModelsCatalog } from '../services/modelsCatalog.js';

export async function getModels(req, res, next) {
  try {
    const catalog = await getModelsCatalog();
    req.log.info({
      event: 'models_catalog_served',
      providerCount: catalog.providers?.length ?? 0,
    });
    res.json(catalog);
  } catch (e) {
    next(e);
  }
}
