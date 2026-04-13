import { env } from '../config/env.js';

const CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

/** Groq OpenAI-compatible chat completions */
export async function chat({ model, messages }) {
  const { apiKey } = env.groq;
  if (!apiKey) {
    const err = new Error('Groq is not configured (set GROQ_API_KEY)');
    err.statusCode = 503;
    throw err;
  }

  if (!model) {
    const err = new Error('model is required');
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
      model,
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
    const err = new Error('Invalid JSON from Groq');
    err.statusCode = 502;
    throw err;
  }

  if (!res.ok) {
    const msg =
      data?.error?.message || data?.message || `Groq request failed (${res.status})`;
    const err = new Error(msg);
    err.statusCode = res.status >= 400 && res.status < 600 ? res.status : 502;
    throw err;
  }

  return data;
}
