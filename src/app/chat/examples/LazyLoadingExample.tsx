'use client';

/**
 * LazyLoadingExample
 *
 * Example showing how to integrate the ChatLazyLoader in a layout component.
 * This demonstrates the recommended approach for optimized chat loading.
 */

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ChatResourceHints from '../components/ChatResourceHints';

// Dynamic import for lazy loading
const ChatLazyLoader = dynamic(() => import('../components/ChatLazyLoader'), {
  ssr: false,
  loading: () => <div className="chat-placeholder">Chat loading...</div>,
});

export default function ChatEnabledLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Add resource hints in header */}
      <ChatResourceHints />

      {/* Main content */}
      <main>{children}</main>

      {/* Chat button positioned in the bottom-right corner */}
      <div className="chat-container">
        <Suspense
          fallback={<div className="chat-placeholder">Loading chat...</div>}
        >
          <ChatLazyLoader
            buttonText="Chat with Us"
            buttonClassName="primary-chat-button"
            onChatInitialized={() => {
              console.log('Chat initialized by user');
              // You can track this event in your analytics
            }}
          />
        </Suspense>
      </div>

      {/* CSS for chat positioning */}
      <style jsx>{`
        .chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 100;
        }

        .chat-placeholder {
          padding: 10px 16px;
          background-color: #f0f0f0;
          border-radius: 4px;
          font-size: 14px;
        }

        :global(.primary-chat-button) {
          padding: 12px 20px;
          background-color: #0078d4;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: background-color 0.2s ease;
        }

        :global(.primary-chat-button:hover) {
          background-color: #006abb;
        }
      `}</style>
    </>
  );
}
