'use client';
import { useChatStore } from '@/app/@chat/stores/chatStore';
import Script from 'next/script';
import { useEffect } from 'react';
import { GenesysBus } from '../types/genesys.types';

/**
 * Legacy chat implementation wrapper
 * Loads Genesys chat.js script with beforeInteractive strategy
 * Injects initialization config with afterInteractive
 */
export default function LegacyChatWrapper() {
  const { userData, formInputs, chatGroup } = useChatStore();

  useEffect(() => {
    // Defensive: close any previous chat session
    // @ts-expect-error: CXBus injected by Genesys script
    if (typeof window.CXBus?.command === 'function') {
      // @ts-expect-error: CXBus injected by Genesys script
      window.CXBus.command('WebChat.close');
    }
    return () => {
      // @ts-expect-error: CXBus injected by Genesys script
      if (typeof window.CXBus?.command === 'function') {
        // @ts-expect-error: CXBus injected by Genesys script
        window.CXBus.command('WebChat.close');
      }
    };
  }, []);

  return (
    <>
      <Script
        src="/assets/genesys/click_to_chat.js"
        strategy="beforeInteractive"
      />

      <Script
        id="legacy-chat-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window._genesys = window._genesys || {};
            window._genesys.widgets = {
              main: {
                theme: 'light',
                lang: 'en',
                plugins: ['cx-webchat']
              },
              webchat: {
                transport: {
                  type: 'purecloud-v2-sockets',
                  dataURL: '${process.env.NEXT_PUBLIC_LEGACY_CHAT_URL}',
                  deploymentKey: '${process.env.NEXT_PUBLIC_LEGACY_DEPLOYMENT_KEY}',
                  orgGuid: '${process.env.NEXT_PUBLIC_LEGACY_ORG_ID}'
                },
                userData: ${JSON.stringify(userData)},
                emojis: true,
                cometD: {
                  enabled: false
                },
                chatButton: {
                  enabled: false
                },
                form: {
                  autoSubmit: true,
                  inputs: ${JSON.stringify(formInputs)}
                },
                chatButton: {
                  enabled: false
                },
                targetType: 'queue',
                targetAddress: '${chatGroup || process.env.NEXT_PUBLIC_LEGACY_QUEUE}'
              }
            };
          `,
        }}
      />
      <div id="genesys-legacy-chat" aria-label="Genesys Legacy Chat" />
    </>
  );
}

//('use client');

declare global {
  interface Window {
    CXBus?: GenesysBus;
  }
}

/**
 * Thin wrapper around the on-prem Genesys click_to_chat.js + widgets.min.js
 */
// export default function LegacyChatWrapper() {
//   return (
//     <>
//       {/* Load legacy widget bundle */}
//       <Script
//         src="/assets/genesys/widgets.min.js"
//         strategy="beforeInteractive"
//       />
//       {/* Inject any additional legacy config (form inputs, headers, i18n, etc.) */}
//       <Script id="legacy-init" strategy="afterInteractive">
//         {`
//           window._genesys = window._genesys || {};
//           window._genesys.widgets = window._genesys.widgets || {};
//           // TODO: populate window._genesys.widgets.webchat with your form inputs, header, i18n, etc.
//         `}
//       </Script>
//     </>
//   );
// }
