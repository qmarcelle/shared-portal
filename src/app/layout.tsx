/* eslint-disable @next/next/no-sync-scripts */

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import '@/app/globals.css';
import { auth } from '@/auth';
import { ClientInitComponent } from '@/components/clientComponents/ClientInitComponent';
import { ErrorBoundary } from '@/components/foundation/ErrorBoundary';
import Footer from '@/components/foundation/Footer';
import { SiteHeaderServerWrapper } from '@/components/serverComponents/StiteHeaderServerWrapper';
import '@/styles/base.css';
import '@/styles/checkbox.css';
import { SessionProvider } from 'next-auth/react';
import 'react-responsive-modal/styles.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ClientLayout from './ClientLayout';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Only fetch userInfo if we have a session and memCk
  const userInfo = session?.user?.currUsr?.plan?.memCk
    ? await getLoggedInUserInfo(session.user.currUsr.plan.memCk)
    : null;

  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <SessionProvider session={session}>
            <ClientInitComponent />
            <SiteHeaderServerWrapper />
            <ClientLayout>{children}</ClientLayout>
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
