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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showHeader = !noHeaderAndFooterRoutes.includes(usePathname());

  useEffect(() => {
    const TagManagerArgs = {
      gtmId: 'GTM-5GNS5V6',
    };
    console.log('Initializing Google Analytics');
    TagManager.initialize(TagManagerArgs);
    //ReactGA.initialize('G-M0JDZR3EBP');
  }, []);

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
      </body>
    </html>
  );
}
