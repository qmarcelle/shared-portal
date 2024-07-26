/* eslint-disable @next/next/no-sync-scripts */
'use client';

import '@/app/globals.css';
import { AppModal } from '@/components/foundation/AppModal';
import { SideBarModal } from '@/components/foundation/SideBarModal';
import '@/styles/base.css';
import '@/styles/checkbox.css';
import { usePathname } from 'next/navigation';
import 'react-responsive-modal/styles.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import SiteHeader from '../../components/foundation/SiteHeader';
import ClientLayout from './ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showHeader = usePathname() == '/login' ? false : true;
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
