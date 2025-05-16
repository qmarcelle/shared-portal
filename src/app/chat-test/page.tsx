'use client';

import {
  ChatLoadingState,
  resetChatLoader,
} from '@/app/chat/utils/chatSequentialLoader';
import { ChatLinkEnhancer } from '@/components/foundation/ChatLinkEnhancer';
import { useEffect, useState } from 'react';
import { EligibilityDebugger } from './EligibilityDebugger';

export default function ChatTestPage() {
  const [stateSnapshot, setStateSnapshot] = useState<any>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Update state snapshot regularly
  useEffect(() => {
    const timer = setInterval(() => {
      setStateSnapshot({ ...ChatLoadingState });
      setRefreshCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResetLoader = () => {
    resetChatLoader();
    setStateSnapshot({ ...ChatLoadingState });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Chat Sequential Loading Test Page
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Chat Links</h2>
            <div className="space-y-4">
              <a
                href="#"
                className="block p-3 bg-blue-100 rounded hover:bg-blue-200"
              >
                Start a chat with us
              </a>
              <a
                href="#"
                className="block p-3 bg-green-100 rounded hover:bg-green-200"
              >
                Click here to chat with an agent
              </a>
              <a
                href="#"
                className="block p-3 bg-purple-100 rounded hover:bg-purple-200"
              >
                Chat with us about your benefits
              </a>
              <a
                href="#"
                className="block p-3 bg-yellow-100 rounded hover:bg-yellow-200"
              >
                Have questions? Start a chat
              </a>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Manual Testing Controls
            </h2>
            <button
              onClick={handleResetLoader}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset Sequential Loader
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            ChatLoadingState Monitor
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Refreshed {refreshCount} times
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Global State</h3>
              <div className="font-mono text-sm bg-white p-2 rounded border">
                isInitialized: {stateSnapshot?.isInitialized ? 'true' : 'false'}
              </div>
            </div>

            <div>
              <h3 className="font-medium">API State</h3>
              <div className="font-mono text-sm bg-white p-2 rounded border">
                <div>
                  isFetching:{' '}
                  {stateSnapshot?.apiState?.isFetching ? 'true' : 'false'}
                </div>
                <div>
                  isComplete:{' '}
                  {stateSnapshot?.apiState?.isComplete ? 'true' : 'false'}
                </div>
                <div>
                  isEligible:{' '}
                  {stateSnapshot?.apiState?.isEligible ? 'true' : 'false'}
                </div>
                <div>
                  chatMode: {stateSnapshot?.apiState?.chatMode || 'null'}
                </div>
                <div>
                  lastFetchTimestamp:{' '}
                  {stateSnapshot?.apiState?.lastFetchTimestamp}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Script State</h3>
              <div className="font-mono text-sm bg-white p-2 rounded border">
                <div>
                  isLoading:{' '}
                  {stateSnapshot?.scriptState?.isLoading ? 'true' : 'false'}
                </div>
                <div>
                  isComplete:{' '}
                  {stateSnapshot?.scriptState?.isComplete ? 'true' : 'false'}
                </div>
                <div>
                  loadAttempts: {stateSnapshot?.scriptState?.loadAttempts}
                </div>
                <div>
                  lastAttemptTimestamp:{' '}
                  {stateSnapshot?.scriptState?.lastAttemptTimestamp}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium">DOM State</h3>
              <div className="font-mono text-sm bg-white p-2 rounded border">
                <div>
                  linksEnhanced:{' '}
                  {stateSnapshot?.domState?.linksEnhanced ? 'true' : 'false'}
                </div>
                <div>buttonCount: {stateSnapshot?.domState?.buttonCount}</div>
                <div>
                  lastUpdateTimestamp:{' '}
                  {stateSnapshot?.domState?.lastUpdateTimestamp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add the eligibility debugger component */}
      <EligibilityDebugger />

      {/* This component will enhance the chat links above */}
      <ChatLinkEnhancer />
    </div>
  );
}
