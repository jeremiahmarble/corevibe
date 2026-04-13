import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const env = {
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL || 'info',
  azureFoundry: {
    endpoint: process.env.AZURE_FOUNDRY_ENDPOINT || '',
    apiKey: process.env.AZURE_FOUNDRY_API_KEY || '',
    model: process.env.AZURE_FOUNDRY_MODEL || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
  },
};
