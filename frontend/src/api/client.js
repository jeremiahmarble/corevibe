function apiBase() {
  return (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
}

function chatUrl() {
  const base = apiBase();
  return base ? `${base}/api/chat` : '/api/chat';
}

function modelsUrl() {
  const base = apiBase();
  return base ? `${base}/api/models` : '/api/models';
}

function parseJsonBody(text) {
  if (!text || !text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text.length > 240 ? `${text.slice(0, 240)}…` : text };
  }
}

function apiErrorMessage(res, data) {
  const base =
    (typeof data?.error === 'string' && data.error) || res.statusText || `Request failed (${res.status})`;
  const ref = data?.requestId ? ` (ref: ${data.requestId})` : '';
  return `${base}${ref}`;
}

async function requestJson(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (e) {
    const hint =
      e instanceof TypeError
        ? 'Network error: could not reach the API. Check that the backend is running and VITE_API_BASE_URL matches the server URL.'
        : e?.message || 'Request failed';
    throw new Error(hint);
  }

  const text = await res.text();
  const data = parseJsonBody(text);

  if (!res.ok) {
    throw new Error(apiErrorMessage(res, data));
  }

  return data;
}

export async function getModels() {
  return requestJson(modelsUrl());
}

export async function postChat(payload) {
  return requestJson(chatUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
