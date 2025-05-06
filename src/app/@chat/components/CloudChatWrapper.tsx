'use client';
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
