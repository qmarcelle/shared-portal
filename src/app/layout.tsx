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
import 'react-responsive-modal/styles.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ClientLayout from './ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showHeader = noHeaderAndFooterRoutes.includes(usePathname());
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
