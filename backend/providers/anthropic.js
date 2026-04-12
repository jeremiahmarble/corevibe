export async function chat() {
  const err = new Error('Anthropic provider is not implemented (Phase 2)');
  err.statusCode = 501;
  throw err;
}
