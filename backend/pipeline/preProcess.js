const MAX_USER_MESSAGE_CHARS = 32000;
const ALLOWED_ROLES = new Set(['user', 'assistant']);

function validatePriorMessages(messages) {
  if (!Array.isArray(messages)) {
    return { ok: false, status: 'failed', reason: 'messages_invalid' };
  }
  for (const m of messages) {
    if (!m || typeof m !== 'object') {
      return { ok: false, status: 'failed', reason: 'messages_invalid' };
    }
    if (!ALLOWED_ROLES.has(m.role)) {
      return { ok: false, status: 'failed', reason: 'messages_invalid_role' };
    }
    if (typeof m.content !== 'string') {
      return { ok: false, status: 'failed', reason: 'messages_invalid_content' };
    }
  }
  return null;
}

/**
 * Stub: validate shape, non-empty prompt, length. Hooks for future RAI checks.
 */
export async function preProcess(body) {
  const { message, messages: priorMessages } = body ?? {};

  const prior = priorMessages ?? [];
  const shapeErr = validatePriorMessages(prior);
  if (shapeErr) return shapeErr;

  if (typeof message !== 'string' || !message.trim()) {
    return {
      ok: false,
      status: 'failed',
      reason: 'message_required',
    };
  }

  if (message.length > MAX_USER_MESSAGE_CHARS) {
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
