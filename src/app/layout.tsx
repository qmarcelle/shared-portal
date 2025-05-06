/* eslint-disable @next/next/no-sync-scripts */
import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import '@/app/globals.css';
import { auth } from '@/auth';
import { ClientInitComponent } from '@/components/clientComponents/ClientInitComponent';
import { ErrorBoundary } from '@/components/foundation/ErrorBoundary';
import Footer from '@/components/foundation/Footer';
import { logServerEnvironment } from '@/components/serverComponents/EnvLogger';
import { SiteHeaderServerWrapper } from '@/components/serverComponents/StiteHeaderServerWrapper';
import '@/styles/base.css';
import '@/styles/checkbox.css';
import { SessionProvider } from 'next-auth/react';
import 'react-responsive-modal/styles.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ChatLoader from './@chat/components/ChatLoader';
import ClientLayout from './ClientLayout';

export default async function RootLayout({
  children,
  chat,
}: {
  children: React.ReactNode;
  chat: React.ReactNode;
}) {
  const session = await auth();

  // Only fetch userInfo if we have a session and memCk
  const memCk = session?.user?.currUsr?.plan?.memCk;
  const userInfo = memCk ? await getLoggedInUserInfo(memCk) : null;

  // Log server environment variables
  await logServerEnvironment();

  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <SessionProvider session={session}>
            <ClientInitComponent />
            <SiteHeaderServerWrapper />
            <ClientLayout>
              {children}
              {session?.user?.currUsr?.plan &&
                userInfo?.members[0].memberCk && (
                  <ChatLoader
                    memberId={userInfo?.members[0].memberCk}
                    planId={session?.user?.currUsr?.plan?.grpId}
                  />
                )}
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
