'use client';

export default function QuickOpen() {
  return (
    <button
      onClick={() => {
        if (window.CXBus && typeof window.CXBus.command === 'function') {
          window.CXBus.command('WebChat.open');
        } else {
          console.warn(
            'CXBus is not available. Genesys Widgets may not be fully loaded.',
          );
        }
      }}
      style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 10000 }}
    >
      Debug: Open Chat
    </button>
  );
}
