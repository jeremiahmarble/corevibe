export default function ModelSelector({ model, onModelChange, disabled }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#8b98a5' }}>
      Model (deployment)
      <input
        type="text"
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        style={{
          padding: '0.5rem 0.6rem',
          borderRadius: 6,
          border: '1px solid #38444d',
          background: '#16181c',
          color: '#e7e9ea',
          fontSize: '0.875rem',
        }}
      />
    </label>
  );
}
