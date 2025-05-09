/* eslint-disable @next/next/no-sync-scripts */
import '@/app/globals.css';
import { auth } from '@/auth';
import { ClientInitComponent } from '@/components/clientComponents/ClientInitComponent';
import { ErrorBoundary } from '@/components/foundation/ErrorBoundary';
import Footer from '@/components/foundation/Footer';
import { logServerEnvironment } from '@/components/serverComponents/EnvLogger';
import { SiteHeaderServerWrapper } from '@/components/serverComponents/StiteHeaderServerWrapper';
import '@/styles/base.css';
import '@/styles/checkbox.css';
import '@/styles/genesys-overrides.css';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Script from 'next/script';
import { Suspense } from 'react';
import 'react-responsive-modal/styles.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { ChatErrorBoundary } from './@chat/components/ChatErrorBoundary';
import ChatLoading from './@chat/loading';
import ClientLayout from './ClientLayout';
const QuickOpen = dynamic(() => import('@/app/components/QuickOpen'), {
  ssr: false,
});

export default async function RootLayout({
  children,
  chat,
}: {
  children: React.ReactNode;
  chat: React.ReactNode;
}) {
  const session = await auth();

  // Log server environment variables
  await logServerEnvironment();

  // Get environment variables for Genesys scripts
  const clickToChatEndpoint =
    process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT || '';
  const chatTokenEndpoint = process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT || '';
  const coBrowseEndpoint =
    process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT || '';
  const bootstrapUrl = process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL || '';
  const widgetUrl = process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL || '';
  const opsPhone = process.env.NEXT_PUBLIC_OPS_PHONE || '';
  const opsPhoneHours = process.env.NEXT_PUBLIC_OPS_HOURS || '';

  return (
    <html lang="en">
      <Head>
        <link
          rel="preload"
          href="/assets/genesys/plugins/widgets.min.css"
          as="style"
        />
      </Head>

      {/* Genesys Chat Scripts - Centralized for optimal loading order */}
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
          
          // Initial chat settings
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

      {/* Bootstrap script - loaded after settings */}
      <Script
        id="genesys-bootstrap"
        src={bootstrapUrl}
        strategy="afterInteractive"
        onLoad={() => console.log('[Genesys] Bootstrap script loaded')}
        onError={() =>
          console.error('[Genesys] Bootstrap script failed to load')
        }
      />

      {/* Widget script - loaded after bootstrap */}
      <Script
        id="genesys-widgets"
        src={widgetUrl}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[Genesys] Widgets script loaded');
          // Dispatch a custom event when scripts are loaded
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('genesys-ready'));
          }
        }}
        onError={() => console.error('[Genesys] Widgets script failed to load')}
      />

      <body>
        <ErrorBoundary>
          <SessionProvider session={session}>
            <ClientInitComponent />
            <SiteHeaderServerWrapper />
            <ClientLayout>
              {children}
              {/* Use the parallel route with Suspense and error boundary */}
              {session?.user?.currUsr?.plan && (
                <ChatErrorBoundary>
                  <Suspense fallback={<ChatLoading />}>{chat}</Suspense>
                </ChatErrorBoundary>
              )}
              {/* Overlay the chat slot using Next.js parallel routes */}
              {chat}
              <QuickOpen />
            </ClientLayout>
            <Footer />
          </SessionProvider>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
          <script
            src="https://apps.pingone.com/signals/web-sdk/5.3.7/signals-sdk.js"
            defer
          ></script>
        </ErrorBoundary>
      </body>
    </html>
  );
}
