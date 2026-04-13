import { useCallback, useEffect, useRef, useState } from 'react';
import { getModels, postChat } from '../api/client.js';
import MessageInput from './MessageInput.jsx';
import MessageList from './MessageList.jsx';
import ModelSelector from './ModelSelector.jsx';

function pickDefaults(catalog, envProvider, envModel) {
  const providers = catalog?.providers ?? [];
  if (providers.length === 0) return { providerId: '', modelId: '' };

  let providerId =
    envProvider && providers.some((p) => p.id === envProvider) ? envProvider : providers[0].id;
  const prov = providers.find((p) => p.id === providerId);
  const models = prov?.models ?? [];
  let modelId =
    envModel && models.some((m) => m.id === envModel) ? envModel : models[0]?.id ?? '';

  return { providerId, modelId };
}

export default function ChatWindow() {
  const mountedRef = useRef(true);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [catalog, setCatalog] = useState(null);
  const [catalogLoadState, setCatalogLoadState] = useState('loading');
  const [catalogError, setCatalogError] = useState(null);
  const [providerId, setProviderId] = useState('');
  const [modelId, setModelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchCatalog = useCallback(async () => {
    setCatalogLoadState('loading');
    setCatalogError(null);
    try {
      const data = await getModels();
      if (!mountedRef.current) return;
      setCatalog(data);
      const envP = import.meta.env.VITE_DEFAULT_PROVIDER;
      const envM = import.meta.env.VITE_DEFAULT_MODEL;
      const { providerId: p, modelId: m } = pickDefaults(data, envP, envM);
      setProviderId(p);
      setModelId(m);
      setCatalogLoadState('ready');
    } catch (e) {
      if (!mountedRef.current) return;
      setCatalog(null);
      setCatalogError(e?.message || 'Could not load models');
      setProviderId('');
      setModelId('');
      setCatalogLoadState('error');
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleProviderChange = useCallback(
    (nextProvider) => {
      setProviderId(nextProvider);
      const prov = catalog?.providers?.find((p) => p.id === nextProvider);
      const first = prov?.models?.[0]?.id ?? '';
      setModelId(first);
    },
    [catalog],
  );

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || loading || !providerId || !modelId) return;

    const priorMessages = messages.map(({ role, content }) => ({ role, content }));

    const userMsg = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setDraft('');
    setError(null);
    setLoading(true);

    try {
      const res = await postChat({
        message: text,
        provider: providerId,
        model: modelId,
        messages: priorMessages,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.outputText || '' }]);
    } catch (e) {
      setError(e?.message || 'Something went wrong');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [draft, loading, messages, modelId, providerId]);

  const catalogReady = catalogLoadState === 'ready';
  const selectorsDisabled = loading || !catalogReady;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <ModelSelector
          catalogLoadState={catalogLoadState}
          providers={catalog?.providers}
          providerId={providerId}
          modelId={modelId}
          onProviderChange={handleProviderChange}
          onModelChange={setModelId}
          disabled={selectorsDisabled}
        />
        {catalogError && (
          <div
            style={{
              marginTop: '0.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <p style={{ color: '#f4212e', fontSize: '0.875rem', margin: 0 }} role="alert">
              {catalogError}
            </p>
            <button
              type="button"
              onClick={() => fetchCatalog()}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8125rem',
                borderRadius: 6,
                border: '1px solid #38444d',
                background: '#16181c',
                color: '#e7e9ea',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
      <MessageList messages={messages} />
      {error && (
        <p style={{ color: '#f4212e', fontSize: '0.875rem', margin: '0.5rem 0 0' }} role="alert">
          {error}
        </p>
      )}
      <MessageInput
        value={draft}
        onChange={setDraft}
        onSend={send}
        disabled={loading || !catalogReady || !providerId || !modelId}
      />
    </section>
  );
}
