export async function chat() {
  const err = new Error('Gemini provider is not implemented (Phase 2)');
  err.statusCode = 501;
  throw err;
}
