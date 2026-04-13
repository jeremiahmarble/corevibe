import { loadSystemPrompt } from '../pipeline/loadSystemPrompt.js';
import { postProcess } from '../pipeline/postProcess.js';
import { preProcess } from '../pipeline/preProcess.js';
import { getProvider } from '../providers/index.js';
import { assertValidModelSelection, getModelsCatalog } from './modelsCatalog.js';
import {
  normalizeChatResponse,
  outputTextFromOpenAICompat,
} from '../utils/normalizeResponse.js';

export async function runChatPipeline(body, log) {
  const { provider: providerName, model, message, messages: priorMessages = [] } = body;

  log.info({
    event: 'chat_request_received',
    provider: providerName,
    model,
    priorMessageCount: priorMessages.length,
  });

  log.info({ event: 'pre_processing_start' });
  const pre = await preProcess(body);
  log.info({
    event: 'pre_processing_end',
    preProcessingStatus: pre.status,
    ...(pre.reason && { reason: pre.reason }),
  });

  if (!pre.ok) {
    log.info({ event: 'pre_processing_rejected', reason: pre.reason });
    const err = new Error(pre.reason || 'Pre-processing failed');
    err.statusCode = 400;
    throw err;
  }

  const catalog = await getModelsCatalog();
  assertValidModelSelection(catalog, providerName, model);
  log.info({
    event: 'model_selection_validated',
    provider: providerName,
    model,
  });

  const messages = [...priorMessages, { role: 'user', content: message.trim() }];

  log.info({ event: 'system_prompt_load' });
  const systemPrompt = await loadSystemPrompt();
  const providerMessages = [{ role: 'system', content: systemPrompt }, ...messages];

  const adapter = getProvider(providerName);
  log.info({
    event: 'provider_selected',
    provider: providerName,
  });

  const modelCallStart = Date.now();
  log.info({ event: 'model_call_start', provider: providerName, model });
  const raw = await adapter.chat({ model, messages: providerMessages });
  log.info({
    event: 'model_call_end',
    provider: providerName,
    model,
    durationMs: Date.now() - modelCallStart,
  });

  const outputText = outputTextFromOpenAICompat(raw);
  let normalized = normalizeChatResponse({
    provider: providerName,
    model,
    outputText,
    meta: {},
  });

  log.info({ event: 'post_processing_start' });
  const post = await postProcess(normalized);
  log.info({
    event: 'post_processing_end',
    postProcessingStatus: post.status,
    ...(post.reason && { reason: post.reason }),
  });

  if (!post.ok) {
    const err = new Error(post.reason || 'Post-processing failed');
    err.statusCode = 502;
    throw err;
  }

  normalized = normalizeChatResponse({
    ...normalized,
    meta: {
      preProcessing: pre.status,
      postProcessing: post.status,
    },
  });

  log.info({
    event: 'response_returned',
    provider: providerName,
    model,
  });

  return normalized;
}
