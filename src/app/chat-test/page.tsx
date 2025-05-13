'use client';

import ChatWidget from '@/components/ChatWidget';
import { useState, useEffect } from 'react';

export default function ChatTestPage() {
  const [mounted, setMounted] = useState(false);

  // Mock chat settings for testing
  const mockChatSettings = {
    chatMode: 'legacy',
    isChatEligibleMember: 'true', 
    isChatAvailable: true,
    isDemoMember: 'true',
    memberClientID: 'INDV',
    groupType: 'INDV',
    isAmplifyMem: 'false',
    cloudChatEligible: false,
    opsPhone: '1-800-123-4567',
    opsPhoneHours: 'Monday-Friday 8am-6pm ET',
    isIDCardEligible: 'true',
    chatbotEligible: 'true'
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Chat Widget Test Page</h1>
      
      <div className="flex flex-col gap-4 max-w-2xl w-full">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Chat Widget Configuration</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80">
            {JSON.stringify(mockChatSettings, null, 2)}
          </pre>
        </div>
        
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Chat Widget Status</h2>
          <p>The chat widget should appear in the bottom right corner of the screen.</p>
          <p>Click on it to open the chat interface.</p>
        </div>
      </div>

      {/* Render the ChatWidget with mock settings */}
      <ChatWidget chatSettings={mockChatSettings} />
    </div>
  );
}