'use client';

import { useEffect, useState } from 'react';

export default function QuickOpen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Poll for window.startChat being available
    const interval = setInterval(() => {
      if (
        typeof window !== 'undefined' &&
        typeof window.startChat === 'function'
      ) {
        setReady(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => {
        if (typeof window.startChat === 'function') {
          window.startChat();
        } else {
          console.warn('Genesys chat is not ready yet.');
        }
      }}
      style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 10000 }}
      disabled={!ready}
      title={ready ? 'Open Genesys Chat' : 'Genesys chat is not ready yet'}
    >
      Debug: Open Chat
    </button>
  );
}
