'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';

// Define MessengerWidget type for TypeScript
declare global {
  interface Window {
    MessengerWidget?: any;
  }
}

export default function CloudChatWrapper() {
  const { userData, routingInteractionId } = useChatStore();
  
  useEffect(() => {
    // Defensive: destroy any previous instance
    if (typeof window.MessengerWidget?.destroy === 'function') {
      window.MessengerWidget.destroy();
    }
    // Optionally, you could re-initialize here if not using <Script>
    return () => {
      if (typeof window.MessengerWidget?.destroy === 'function') {
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
