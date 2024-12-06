'use client';
import { initPingOne } from '@/app/pingOne/setupPingOne';
import { GTM_ID } from '@/utils/analytics';
import { noHeaderAndFooterRoutes } from '@/utils/routes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { AppModal } from '../foundation/AppModal';
import { SideBarModal } from '../foundation/SideBarModal';

export const ClientInitComponent = () => {
  useEffect(() => {
    const TagManagerArgs = {
      gtmId: GTM_ID,
      dataLayer: {
        business_unit: 'member',
        page_name: window.document.title,
      },
    };
    console.log('Initializing Google Analytics');
    TagManager.initialize(TagManagerArgs);

    initPingOne();
  }, []);
  const showHeader = !noHeaderAndFooterRoutes.includes(usePathname());
  return (
    <>
      {showHeader && (
        <>
          <SideBarModal />
        </>
      )}
      <AppModal />
    </>
  );
};
