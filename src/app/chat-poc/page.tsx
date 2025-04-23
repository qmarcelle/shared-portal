'use client';

import { useEffect, useState } from 'react';

/**
 * Test page for chat POC that bypasses normal auth flow
 */
export default function ChatPOCPage() {
  const [isMockAuthed, setIsMockAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !isMockAuthed) {
      // Clean up any existing scripts when toggling off
      const configEl = document.querySelector('script[src="/chat-config.js"]');
      const chatEl = document.querySelector('script[src="/chat.js"]');
      if (configEl) configEl.remove();
      if (chatEl) chatEl.remove();
      return;
    }

    setIsLoading(true);

    // Function to load scripts in sequence
    const loadScripts = async () => {
      try {
        // Load config first and wait for it to be processed
        await new Promise((resolve, reject) => {
          const configScript = document.createElement('script');
          configScript.src = '/chat-config.js';
          configScript.onload = () => {
            // Ensure config is fully processed
            setTimeout(resolve, 200);
          };
          configScript.onerror = reject;
          document.head.appendChild(configScript);
        });

        console.log('[CHAT] Config script loaded and processed');

        // Verify Genesys configuration
        if (!window._genesys?.deploymentId || !window._genesys?.environment) {
          throw new Error('Genesys configuration not properly initialized');
        }

        // Then load chat.js
        await new Promise((resolve, reject) => {
          const chatScript = document.createElement('script');
          chatScript.src = '/chat.js';
          chatScript.onload = resolve;
          chatScript.onerror = reject;
          document.head.appendChild(chatScript);
        });

        console.log('[CHAT] Chat script loaded');
        setIsLoading(false);
      } catch (error) {
        console.error('[CHAT] Failed to load scripts:', error);
        setIsLoading(false);
      }
    };

    loadScripts();

    // Cleanup function
    return () => {
      const configEl = document.querySelector('script[src="/chat-config.js"]');
      const chatEl = document.querySelector('script[src="/chat.js"]');
      if (configEl) configEl.remove();
      if (chatEl) chatEl.remove();
    };
  }, [isMockAuthed]);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Chat POC Test Page</h1>

      {/* Mock Auth Toggle */}
      <div className="mb-8 p-4 bg-blue-100 rounded-lg">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isMockAuthed}
            onChange={(e) => setIsMockAuthed(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
            disabled={isLoading}
          />
          <span>Mock Authenticated State</span>
        </label>
        <p className="mt-2 text-sm text-gray-600">
          {isLoading
            ? 'Loading chat scripts...'
            : 'Toggle this to simulate an authenticated user state'}
        </p>
      </div>

      {/* Chat Container */}
      <div
        id="chatContainer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '400px',
          height: '600px',
          display: isMockAuthed ? 'block' : 'none',
        }}
      />

      {/* Instructions */}
      <div className="space-y-4">
        <div className="p-4 bg-yellow-100 rounded-lg">
          <h2 className="font-semibold mb-2">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Toggle the &quot;Mock Authenticated State&quot; checkbox above
            </li>
            <li>The chat widget should appear in the bottom right</li>
            <li>Click the chat button to open the widget</li>
            <li>Try sending test messages</li>
          </ol>
        </div>

        <div className="p-4 bg-green-100 rounded-lg">
          <h2 className="font-semibold mb-2">Current Configuration:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(
              {
                main: {
                  debug: true,
                  plugins: ['cx-webchat-service', 'cx-webchat'],
                  deploymentId: 'local-deployment',
                  environment: 'test',
                },
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    </main>
  );
}
