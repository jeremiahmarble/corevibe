export default function MessageInput({ value, onChange, onSend, disabled }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Message…"
        style={{
          flex: 1,
          resize: 'vertical',
          padding: '0.6rem',
          borderRadius: 8,
          border: '1px solid #38444d',
          background: '#16181c',
          color: '#e7e9ea',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
        }}
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        style={{
          alignSelf: 'flex-end',
          padding: '0.6rem 1rem',
          borderRadius: 8,
          border: 'none',
          background: '#1d9bf0',
          color: '#fff',
          fontWeight: 600,
          cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          opacity: disabled || !value.trim() ? 0.5 : 1,
        }}
      >
        Send
      </button>
    </div>
  );
}
