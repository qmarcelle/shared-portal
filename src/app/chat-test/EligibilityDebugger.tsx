'use client';

import { chatConfigSelectors, useChatStore } from '@/app/chat/stores/chatStore';
import { useState } from 'react';

export function EligibilityDebugger() {
  const isLoading = useChatStore(chatConfigSelectors.isLoading);
  const error = useChatStore(chatConfigSelectors.error);
  const isEligible = useChatStore(chatConfigSelectors.isEligible);
  const chatMode = useChatStore(chatConfigSelectors.chatMode);
  const isChatEnabled = useChatStore(chatConfigSelectors.isChatEnabled);
  const chatGroup = useChatStore(chatConfigSelectors.chatGroup);
  const isOOO = useChatStore(chatConfigSelectors.isOOO); // Out of office
  const loadChatConfiguration = useChatStore(
    (state) => state.actions.loadChatConfiguration,
  );

  const [eligibilityCallCount, setEligibilityCallCount] = useState(0);

  // Force eligibility check
  const handleForceCheck = () => {
    loadChatConfiguration(
      '12345', // Sample member ID
      'SAMPLE_GROUP',
      'MEM',
      {
        groupId: 'SAMPLE_GROUP',
        memberId: '12345',
      },
    );
    setEligibilityCallCount((prev) => prev + 1);
  };

  return (
    <div className="mt-8 p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Eligibility Status</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-medium mb-2">Current Eligibility Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-gray-50">
              <span className="font-medium">Is Loading:</span>
              <span
                className={isLoading ? 'text-yellow-600' : 'text-green-600'}
              >
                {isLoading ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50">
              <span className="font-medium">Has Error:</span>
              <span className={error ? 'text-red-600' : 'text-green-600'}>
                {error ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50">
              <span className="font-medium">Is Eligible:</span>
              <span className={isEligible ? 'text-green-600' : 'text-red-600'}>
                {isEligible ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50">
              <span className="font-medium">Chat Mode:</span>
              <span className="font-mono">{chatMode || 'Not Set'}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50">
              <span className="font-medium">Chat Enabled:</span>
              <span
                className={isChatEnabled ? 'text-green-600' : 'text-red-600'}
              >
                {isChatEnabled ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50">
              <span className="font-medium">Chat Group:</span>
              <span className="font-mono">{chatGroup || 'Not Set'}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50">
              <span className="font-medium">Out of Office:</span>
              <span className={isOOO ? 'text-red-600' : 'text-green-600'}>
                {isOOO ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Testing Controls</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Eligibility checks called:{' '}
                <span className="font-mono">{eligibilityCallCount}</span>
              </p>
              <button
                onClick={handleForceCheck}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Force Eligibility Check
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <h4 className="font-medium text-red-700">Error Details:</h4>
                <pre className="text-xs mt-1 text-red-800 overflow-auto">
                  {error.message}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
