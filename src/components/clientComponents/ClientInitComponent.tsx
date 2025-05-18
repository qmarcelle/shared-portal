'use client';
import { initMocks } from '@/app/api/mocks';
import { initPingOne } from '@/app/pingOne/setupPingOne';
import { GTM_ID } from '@/utils/analytics';
import { logger } from '@/utils/logger';
import { noHeaderAndFooterRoutes } from '@/utils/routes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { AppLink } from '../foundation/AppLink';
import { AppModal } from '../foundation/AppModal';
import { SideBarModal } from '../foundation/SideBarModal';

export const ClientInitComponent = () => {
  useEffect(() => {
    // Log environment configuration at startup
    logger.info('Initializing ClientInitComponent');

    const TagManagerArgs = {
      gtmId: GTM_ID,
      dataLayer: {
        business_unit: 'member',
        page_name: window.document.title,
      },
    };
    console.log('Initializing Google Analytics');
    TagManager.initialize(TagManagerArgs);

    // Initialize MSW if API mocking is enabled
    initMocks();

    initPingOne();
  }, []);
  const showHeader = !noHeaderAndFooterRoutes.includes(usePathname());
  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-5GNS5V6"
          height="0"
          width="0"
          className="hidden invisible"
        ></iframe>
      </noscript>
      {/* End Google Tag Manager (noscript) */}
      {showHeader && (
        <>
          <AppLink
            label="SKIP TO CONTENT."
            className="!no-underline skipButton"
            linkUnderline="!no-underline"
            url="#main"
            type="link"
          />
          <SideBarModal />
        </>
      )}
      <AppModal />
    </>
  );
};
