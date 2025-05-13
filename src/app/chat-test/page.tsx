'use client';

import ChatWidget from '@/components/ChatWidget';
import { useEffect, useState } from 'react';

// Minimal mock settings that satisfy TypeScript but are cast to any
const mockChatSettings = {
  widgetUrl: '/assets/genesys/plugins/widgets.min.js',
  clickToChatJs: '/assets/genesys/click_to_chat.js',
  clickToChatEndpoint: '/api/chat/getChatInfo',
  chatTokenEndpoint: '/api/chat/token',
  coBrowseEndpoint: '/api/chat/cobrowse',
  opsPhone: '1-800-123-4567',
  opsPhoneHours: 'Monday-Friday 8am-6pm ET',

  // Optional config
  chatMode: 'legacy',
  isChatEligibleMember: 'true',
  isChatAvailable: true,
  isDemoMember: 'true',
  memberClientID: 'INDV',
  groupType: 'INDV',
  isAmplifyMem: 'false',
  cloudChatEligible: false,
  isIDCardEligible: 'true',
  chatbotEligible: 'true',
};

export default function ChatTestPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to manually force chat button visibility
  const forceShowChatButton = () => {
    console.log('Manually triggering chat button visibility');

    if (typeof window !== 'undefined') {
      // First make sure chat settings are set
      if (!window.chatSettings) {
        // Cast to any to avoid TypeScript errors
        window.chatSettings = mockChatSettings as any;
        console.log('Set window.chatSettings');
      }

      // Try to force enable via Genesys
      if (window._genesys && window._genesys.widgets) {
        window._genesys.widgets.webchat = window._genesys.widgets.webchat || {};
        window._genesys.widgets.webchat.chatButton = {
          enabled: true,
          template:
            '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
          openDelay: 100,
          effectDuration: 200,
          hideDuringInvite: false,
        };

        // Try to force style the button
        setTimeout(() => {
          const btn = document.querySelector(
            '.cx-webchat-chat-button',
          ) as HTMLElement;
          if (btn) {
            Object.assign(btn.style, {
              display: 'flex',
              opacity: '1',
              visibility: 'visible',
              backgroundColor: '#0078d4',
              color: 'white',
              padding: '15px 25px',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              position: 'fixed',
              right: '20px',
              bottom: '20px',
              zIndex: '9999',
              fontWeight: 'bold',
              fontSize: '16px',
            });
            console.log('Applied styles to chat button');
          } else {
            console.warn('Chat button not found in DOM');
          }
        }, 500);
      } else {
        console.warn('Genesys widgets not loaded');
      }
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Chat Widget Test Page</h1>

      <div className="flex flex-col gap-4 max-w-2xl w-full">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Chat Widget Configuration
          </h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80">
            {JSON.stringify(mockChatSettings, null, 2)}
          </pre>

          <button
            onClick={forceShowChatButton}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Force Show Chat Button
          </button>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Chat Widget Status</h2>
          <p>
            The chat widget should appear in the bottom right corner of the
            screen.
          </p>
          <p>Click on it to open the chat interface.</p>
          <p className="mt-4 text-sm text-gray-600">
            If the button is not appearing, try clicking the &quot;Force Show
            Chat Button&quot; above.
          </p>
        </div>
      </div>

      {/* Render the ChatWidget with mock settings */}
      <ChatWidget chatSettings={mockChatSettings} />
    </div>
  );
}
