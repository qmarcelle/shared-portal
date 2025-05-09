'use client';
import Script from 'next/script';

interface GenesysScriptsProps {
  clickToChatEndpoint: string;
  chatTokenEndpoint: string;
  coBrowseEndpoint: string;
  bootstrapUrl: string;
  widgetUrl: string;
  opsPhone: string;
  opsPhoneHours: string;
}

export default function GenesysScripts({
  clickToChatEndpoint,
  chatTokenEndpoint,
  coBrowseEndpoint,
  bootstrapUrl,
  widgetUrl,
  opsPhone,
  opsPhoneHours,
}: GenesysScriptsProps) {
  return (
    <>
      {/* Settings initialization */}
      <Script id="genesys-settings" strategy="afterInteractive">
        {`
          window._genesys = window._genesys || {};
          window._genesys.widgets = {
            main: {
              theme: 'light',
              lang: 'en',
              debug: false
            }
          };
          window.chatSettings = {
            clickToChatEndpoint: '${clickToChatEndpoint}',
            chatTokenEndpoint: '${chatTokenEndpoint}',
            coBrowseEndpoint: '${coBrowseEndpoint}',
            bootstrapUrl: '${bootstrapUrl}',
            widgetUrl: '${widgetUrl}',
            opsPhone: '${opsPhone}',
            opsPhoneHours: '${opsPhoneHours}'
          };
          console.log('[Genesys] Settings initialized');
        `}
      </Script>
      {/* Bootstrap script */}
      <Script
        id="genesys-bootstrap"
        src={bootstrapUrl}
        strategy="afterInteractive"
        onLoad={() => console.log('[Genesys] Bootstrap script loaded')}
        onError={() =>
          console.error('[Genesys] Bootstrap script failed to load')
        }
      />
      {/* Widget script */}
      <Script
        id="genesys-widgets"
        src={widgetUrl}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[Genesys] Widgets script loaded');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('genesys-ready'));
          }
        }}
        onError={() => console.error('[Genesys] Widgets script failed to load')}
      />
    </>
  );
}
