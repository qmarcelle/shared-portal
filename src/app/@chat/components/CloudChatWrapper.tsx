'use client';

// CloudChatWrapper injects the Genesys Cloud Messenger SDK and manages Messenger-specific events.
// All script loading, Messenger events, and errors are logged for traceability and debugging.

import { useChatStore } from '../stores/chatStore';
import { GenesysScript } from './GenesysScript';

export default function CloudChatWrapper() {
  const { userData } = useChatStore();
  return (
    <GenesysScript
      userData={userData}
      deploymentId={process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID!}
      orgId={process.env.NEXT_PUBLIC_GENESYS_ORG_ID!}
    />
  );
}
