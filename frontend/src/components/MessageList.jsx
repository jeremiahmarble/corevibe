export default function MessageList({ messages }) {
  return (
    <div
      role="log"
      aria-live="polite"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.75rem',
        border: '1px solid #38444d',
        borderRadius: 8,
        background: '#16181c',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {messages.length === 0 && (
        <p style={{ margin: 0, color: '#8b98a5', fontSize: '0.875rem' }}>Send a message to start.</p>
      )}
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '92%',
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            background: m.role === 'user' ? '#1d9bf0' : '#2f3336',
            color: m.role === 'user' ? '#fff' : '#e7e9ea',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          <span style={{ fontSize: '0.65rem', opacity: 0.85, display: 'block', marginBottom: '0.2rem' }}>
            {m.role}
          </span>
          {m.content}
        </div>
      ))}
    </div>
  );
}
