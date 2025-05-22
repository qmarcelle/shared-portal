/* eslint-disable @next/next/no-sync-scripts */

import '@/../public/assets/genesys/plugins/widgets.min.css';
import '@/app/globals.css';
import { ClientInitComponent } from '@/components/clientComponents/ClientInitComponent';
import { FooterServerWrapper } from '@/components/serverComponents/FooterServerWrapper';
import { SiteHeaderServerWrapper } from '@/components/serverComponents/StiteHeaderServerWrapper';
import '@/styles/base.css';
import '@/styles/checkbox.css';
import '@/styles/genesys-overrides.css';
import 'react-responsive-modal/styles.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import ClientLayout from './ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientInitComponent />
        <SiteHeaderServerWrapper />
        <ClientLayout>{children}</ClientLayout>
        <FooterServerWrapper />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
        <script
          src="https://apps.pingone.com/signals/web-sdk/5.3.7/signals-sdk.js"
          defer
        ></script>
      </body>
    </html>
  );
}
