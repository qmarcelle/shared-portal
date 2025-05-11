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
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import 'react-responsive-modal/styles.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ClientLayout from './ClientLayout';

const QuickOpen = dynamic(() => import('@/app/components/QuickOpen'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Shared Portal',
  description: 'Member portal application',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('[RootLayout] Rendered. children:', children);
  const session = await auth();

  // Log server environment variables
  await logServerEnvironment();

  // Get environment variables for Genesys scripts
  const _clickToChatEndpoint =
    process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT || '';
  const _chatTokenEndpoint = process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT || '';
  const _coBrowseEndpoint =
    process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT || '';
  const _bootstrapUrl = process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL || '';
  const _widgetUrl = process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL || '';
  const _opsPhone = process.env.NEXT_PUBLIC_OPS_PHONE || '';
  const _opsPhoneHours = process.env.NEXT_PUBLIC_OPS_HOURS || '';

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/assets/genesys/plugins/widgets.min.css"
          as="style"
        />
      </head>

      <body>
        <ErrorBoundary>
          <SessionProvider session={session}>
            <ClientInitComponent />
            <SiteHeaderServerWrapper />
            <ClientLayout>
              {children}
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
