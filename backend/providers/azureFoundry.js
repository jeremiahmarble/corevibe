import { env } from '../config/env.js';

const API_VERSION = '2024-08-01-preview';

function buildChatUrl(endpoint, deploymentName) {
  const trimmed = endpoint.trim();
  if (trimmed.includes('chat/completions')) {
    return trimmed.includes('api-version=')
      ? trimmed
      : `${trimmed}${trimmed.includes('?') ? '&' : '?'}api-version=${API_VERSION}`;
  }

  const base = trimmed.replace(/\/$/, '');
  return `${base}/openai/deployments/${encodeURIComponent(deploymentName)}/chat/completions?api-version=${API_VERSION}`;
}

/**
 * Azure OpenAI–compatible chat completions (covers common Azure AI Foundry deployments).
 */
export async function chat({ model, messages }) {
  const { endpoint, apiKey, model: defaultModel } = env.azureFoundry;
  if (!endpoint || !apiKey) {
    const err = new Error('Azure Foundry is not configured');
    err.statusCode = 503;
    throw err;
  }

  const deploymentName = model || defaultModel;
  if (!deploymentName) {
    const err = new Error('Model or AZURE_FOUNDRY_MODEL is required');
    err.statusCode = 400;
    throw err;
  }

  const url = buildChatUrl(endpoint, deploymentName);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  const rawText = await res.text();
  let data;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    const err = new Error('Invalid JSON from Azure Foundry');
    err.statusCode = 502;
    throw err;
  }

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      `Azure Foundry request failed (${res.status})`;
    const err = new Error(msg);
    err.statusCode = res.status >= 400 && res.status < 600 ? res.status : 502;
    throw err;
  }

  return data;
}
