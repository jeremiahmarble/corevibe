export function normalizeChatResponse({ provider, model, outputText, meta = {} }) {
  return {
    provider,
    model,
    outputText: outputText ?? '',
    meta,
  };
}

/** OpenAI / Azure OpenAI–compatible chat completion JSON */
export function outputTextFromOpenAICompat(raw) {
  return raw?.choices?.[0]?.message?.content ?? '';
}
