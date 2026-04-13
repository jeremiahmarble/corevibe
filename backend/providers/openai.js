import { env } from '../config/env.js';

const CHAT_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * OpenAI Chat Completions (responses match OpenAI / Azure OpenAI–compatible shape).
 */
export async function chat({ model, messages }) {
  const { apiKey, model: defaultModel } = env.openai;
  if (!apiKey) {
    const err = new Error('OpenAI is not configured (set OPENAI_API_KEY)');
    err.statusCode = 503;
    throw err;
  }

  const modelName = model || defaultModel;
  if (!modelName) {
    const err = new Error('Model or OPENAI_MODEL is required');
    err.statusCode = 400;
    throw err;
  }

  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
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
    const err = new Error('Invalid JSON from OpenAI');
    err.statusCode = 502;
    throw err;
  }

  if (!res.ok) {
    const msg =
      data?.error?.message || data?.message || `OpenAI request failed (${res.status})`;
    const err = new Error(msg);
    err.statusCode = res.status >= 400 && res.status < 600 ? res.status : 502;
    throw err;
  }

  return data;
}
