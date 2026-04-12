export async function chat() {
  const err = new Error('Groq provider is not implemented (Phase 2)');
  err.statusCode = 501;
  throw err;
}
