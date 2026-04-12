import { useCallback, useState } from 'react';
import { postChat } from '../api/client.js';
import MessageInput from './MessageInput.jsx';
import MessageList from './MessageList.jsx';
import ModelSelector from './ModelSelector.jsx';

const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4o-mini';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setDraft('');
    setError(null);
    setLoading(true);

    try {
      const res = await postChat({
        provider: 'azure-foundry',
        model,
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.outputText || '' }]);
    } catch (e) {
      setError(e?.message || 'Something went wrong');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [draft, loading, messages, model]);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.75rem', color: '#8b98a5' }}>
          Provider: <strong style={{ color: '#e7e9ea' }}>azure-foundry</strong>
        </div>
        <ModelSelector model={model} onModelChange={setModel} disabled={loading} />
      </div>
      <MessageList messages={messages} />
      {error && (
        <p style={{ color: '#f4212e', fontSize: '0.875rem', margin: '0.5rem 0 0' }} role="alert">
          {error}
        </p>
      )}
      <MessageInput value={draft} onChange={setDraft} onSend={send} disabled={loading} />
    </section>
  );
}
