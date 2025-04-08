'use client';

import { ChatWidget } from './components/core/ChatWidget';
import { ChatContextProvider } from './components/providers/ChatContextProvider';
import type { ChatConfig, GenesysUserData } from './types/types';

// Default config for development - should be overridden in production
const defaultConfig: ChatConfig = {
  token: process.env.NEXT_PUBLIC_CHAT_TOKEN || '',
  endPoint: process.env.NEXT_PUBLIC_CHAT_ENDPOINT || '',
  opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE || '',
  userID: '',
  memberFirstname: '',
  memberLastname: '',
  memberId: '',
  groupId: '',
  planId: '',
  planName: '',
  businessHours: {
    isOpen24x7: false,
    days: [],
    timezone: 'America/New_York',
    isCurrentlyOpen: true,
    lastUpdated: Date.now(),
    source: 'default',
  },
};

// Default user data for development - should be overridden in production
const defaultUserData: Partial<GenesysUserData> = {
  config: {
    deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '',
    region: process.env.NEXT_PUBLIC_GENESYS_REGION || '',
  },
  userInfo: {
    firstName: '',
    lastName: '',
  },
};

export default function ChatPage() {
  return (
    <ChatContextProvider config={defaultConfig} userData={defaultUserData}>
      <div className="chat-container">
        <ChatWidget />
      </div>
    </ChatContextProvider>
  );
}
