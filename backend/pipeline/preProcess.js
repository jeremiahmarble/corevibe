const MAX_USER_MESSAGE_CHARS = 32000;

function getLastUserContent(messages) {
  if (!Array.isArray(messages)) return null;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (m && m.role === 'user' && typeof m.content === 'string') {
      return m.content;
    }
  }
  return null;
}

/**
 * Stub: validate shape, non-empty prompt, length. Hooks for future RAI checks.
 */
export async function preProcess(body) {
  const { messages } = body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return {
      ok: false,
      status: 'failed',
      reason: 'messages_required',
    };
  }

  const content = getLastUserContent(messages);
  if (content == null || !content.trim()) {
    return {
      ok: false,
      status: 'failed',
      reason: 'empty_user_message',
    };
  }

  if (content.length > MAX_USER_MESSAGE_CHARS) {
    return {
      ok: false,
      status: 'failed',
      reason: 'message_too_long',
    };
  }

  return {
    ok: true,
    status: 'passed',
  };
}
