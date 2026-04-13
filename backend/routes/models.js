import { Router } from 'express';
import { getModels } from '../controllers/modelsController.js';

export const modelsRouter = Router();

modelsRouter.get('/models', getModels);
