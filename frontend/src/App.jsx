import ChatWindow from './components/ChatWindow.jsx';

export default function App() {
  const title = import.meta.env.VITE_APP_NAME || 'CoreVibe';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 720, margin: '0 auto', width: '100%', padding: '1rem' }}>
      <header style={{ marginBottom: '0.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h1>
      </header>
      <ChatWindow />
    </div>
  );
}
