/**
 * Stub: ensure output exists; hooks for future RAI / policy checks.
 */
export async function postProcess(normalized) {
  const text = normalized?.outputText;
  if (typeof text !== 'string' || !text.trim()) {
    return {
      ok: false,
      status: 'failed',
      reason: 'empty_model_output',
    };
  }

  return {
    ok: true,
    status: 'passed',
  };
}
