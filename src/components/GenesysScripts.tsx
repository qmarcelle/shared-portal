'use client';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import Script from 'next/script';

export default function GenesysScripts() {
  const chatMode = useChatStore((s) => s.chatMode);
  const cloudBootstrapUrl = process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL || '';
  const cloudWidgetUrl = process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL || '';
  const legacyUrl = process.env.NEXT_PUBLIC_LEGACY_CHAT_SCRIPT_URL || '';

  if (chatMode === 'cloud') {
    return (
      <>
        <Script src={cloudBootstrapUrl} strategy="afterInteractive" />
        <Script src={cloudWidgetUrl} strategy="afterInteractive" />
      </>
    );
  }
  if (chatMode === 'legacy') {
    return <Script src={legacyUrl} strategy="afterInteractive" />;
  }
  return null;
}
