const selectStyle = {
  padding: '0.5rem 0.6rem',
  borderRadius: 6,
  border: '1px solid #38444d',
  background: '#16181c',
  color: '#e7e9ea',
  fontSize: '0.875rem',
  minWidth: '10rem',
};

/**
 * @param {'loading' | 'ready' | 'error'} catalogLoadState
 */
export default function ModelSelector({
  catalogLoadState,
  providers,
  providerId,
  modelId,
  onProviderChange,
  onModelChange,
  disabled,
}) {
  const list = Array.isArray(providers) ? providers : [];
  const current = list.find((p) => p.id === providerId);
  const models = Array.isArray(current?.models) ? current.models : [];

  const loading = catalogLoadState === 'loading';
  const failed = catalogLoadState === 'error';

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#8b98a5' }}>
        Provider
        <select
          value={providerId || ''}
          onChange={(e) => onProviderChange(e.target.value)}
          disabled={disabled || loading || failed || list.length === 0}
          style={selectStyle}
          aria-busy={loading}
        >
          {loading && list.length === 0 ? <option value="">Loading…</option> : null}
          {failed ? <option value="">Unavailable</option> : null}
          {!loading && !failed && list.length === 0 ? <option value="">No providers</option> : null}
          {list.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name || p.id}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#8b98a5' }}>
        Model
        <select
          value={modelId || ''}
          onChange={(e) => onModelChange(e.target.value)}
          disabled={disabled || loading || failed || models.length === 0}
          style={{ ...selectStyle, minWidth: '12rem' }}
          aria-busy={loading}
        >
          {loading && models.length === 0 ? <option value="">Loading…</option> : null}
          {failed ? <option value="">—</option> : null}
          {!loading && !failed && models.length === 0 ? <option value="">—</option> : null}
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name || m.id}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
