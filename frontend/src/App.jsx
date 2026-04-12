import ChatWindow from './components/ChatWindow.jsx';

export default function App() {
  const title = import.meta.env.VITE_APP_NAME || 'CoreVibe';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 720, margin: '0 auto', width: '100%', padding: '1rem' }}>
      <header style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h1>
        <p style={{ margin: '0.25rem 0 0', color: '#8b98a5', fontSize: '0.875rem' }}>Phase 1 chat (Azure Foundry)</p>
      </header>
      <ChatWindow />
    </div>
  );
}
