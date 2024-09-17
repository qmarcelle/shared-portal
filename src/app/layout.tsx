/* eslint-disable @next/next/no-sync-scripts */
'use client';

import '@/app/globals.css';
import { AppModal } from '@/components/foundation/AppModal';
import { SideBarModal } from '@/components/foundation/SideBarModal';
import SiteHeader from '@/components/foundation/SiteHeader';
import '@/styles/base.css';
import '@/styles/checkbox.css';
import { noHeaderAndFooterRoutes } from '@/utils/routes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import 'react-responsive-modal/styles.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ClientLayout from './ClientLayout';
import { initPingOne } from './pingOne/setupPingOne';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const TagManagerArgs = {
      gtmId: 'GTM-5GNS5V6',
    };
    console.log('Initializing Google Analytics');
    TagManager.initialize(TagManagerArgs);
    //ReactGA.initialize('G-M0JDZR3EBP');
    initPingOne();
  }, []);
  const showHeader = !noHeaderAndFooterRoutes.includes(usePathname());
  return (
    <html lang="en">
      <body>
        {showHeader && (
          <>
            <SideBarModal />
            <SiteHeader />
          </>
        )}
        <ClientLayout>{children}</ClientLayout>
        <AppModal />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
        <script
          src="https://apps.pingone.com/signals/web-sdk/5.3.7/signals-sdk.js"
          defer
        ></script>
      </body>
    </html>
  );
}
