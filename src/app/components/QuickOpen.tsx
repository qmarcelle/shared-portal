'use client';

export default function QuickOpen() {
  return (
    <button
      onClick={() => window._genesys?.widgets?.webchat?.open()}
      style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 10000 }}
    >
      Debug: Open Chat
    </button>
  );
}
