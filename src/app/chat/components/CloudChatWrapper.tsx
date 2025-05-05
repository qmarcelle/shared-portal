'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';

/**
 * Cloud chat implementation wrapper
 * Loads Genesys Web Messaging SDK with beforeInteractive strategy
 * Injects initialization config with afterInteractive
 */
export default function CloudChatWrapper() {
  const { userData, routingInteractionId } = useChatStore();

  useEffect(() => {
    // Defensive: destroy any previous instance
    // @ts-expect-error: MessengerWidget.destroy is injected by Genesys script
    if (typeof window.MessengerWidget?.destroy === 'function') {
      // @ts-expect-error: MessengerWidget.destroy is injected by Genesys script
      window.MessengerWidget.destroy();
    }
    // Optionally, you could re-initialize here if not using <Script>
    return () => {
      // @ts-expect-error: MessengerWidget.destroy is injected by Genesys script
      if (typeof window.MessengerWidget?.destroy === 'function') {
        // @ts-expect-error: MessengerWidget.destroy is injected by Genesys script
        window.MessengerWidget.destroy();
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://apps.mypurecloud.com/messenger/sdk/v1/sdk.min.js"
        strategy="beforeInteractive"
      />
      {/* <Script
        id="cloud-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `MessengerWidget.init({environment:'${process.env.NEXT_PUBLIC_GC_ENV}',orgGuid:'${process.env.NEXT_PUBLIC_GC_ORG_ID}',deploymentKey:'${process.env.NEXT_PUBLIC_GC_DEPLOYMENT_KEY}',routingTarget:{targetType:'QUEUE',targetAddress:'${process.env.NEXT_PUBLIC_GC_QUEUE}'}});`,
        }}
      /> */}
      {/* 2️⃣ Initialize with your env vars */}
      <Script id="cloud-messenger-init" strategy="afterInteractive">
        {`
          window.MessengerWidget = window.MessengerWidget || {};
          MessengerWidget.init({
            environment: '${process.env.NEXT_PUBLIC_GC_ENV}',
            orgGuid: '${process.env.NEXT_PUBLIC_GC_ORG_ID}',
            deploymentKey: '${process.env.NEXT_PUBLIC_GC_DEPLOYMENT_KEY}',
            routingTarget: {
              targetType: 'QUEUE',
              targetAddress: '${process.env.NEXT_PUBLIC_GC_QUEUE}'
            },
            userData: ${JSON.stringify(userData)},
            ${routingInteractionId ? `interactionId: '${routingInteractionId}',` : ''}
            launcherButtonPosition: 'none'
          });
        `}
      </Script>
      <div id="genesys-cloud-messenger" aria-label="Genesys Cloud Messenger" />
    </>
  );
}
