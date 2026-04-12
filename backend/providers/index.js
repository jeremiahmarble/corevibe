import * as azureFoundry from './azureFoundry.js';
import * as anthropic from './anthropic.js';
import * as gemini from './gemini.js';
import * as groq from './groq.js';
import * as openai from './openai.js';

const registry = {
  'azure-foundry': azureFoundry,
  openai,
  anthropic,
  gemini,
  groq,
};

export function getProvider(name) {
  const adapter = registry[name];
  if (!adapter) {
    const err = new Error(`Unknown provider: ${name}`);
    err.statusCode = 400;
    throw err;
  }
  return adapter;
}
