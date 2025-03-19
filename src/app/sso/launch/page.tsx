'use client';

import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalIcon, leftIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import buildSSOLink, { buildDropOffSSOLink } from '../actions/buildSSOPing';
import ssoDropOffToPing from '../actions/dropOffToPing';
import { SSO_IMPL_MAP, SSO_TEXT_MAP } from '../ssoConstants';

const LaunchSSO = () => {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get('PartnerSpId');
  const alternateSSOText = searchParams.get('alternateText');
  const [ssoUrl, setSSOUrl] = useState('');
  const [isError, setIsError] = useState(false);
  const sso = alternateSSOText
    ? decodeURIComponent(alternateSSOText)
    : SSO_TEXT_MAP.get(partnerId ?? '');
  const ssoImpl = partnerId != null ? SSO_IMPL_MAP.get(partnerId) : 'Not Found';
  const initialized = useRef(false);
  const router = useRouter();

  const isDropOffSSO = (partnerId: string): boolean => {
    const isDropOffSSONeeded =
      process.env.NEXT_PUBLIC_PINGONE_SSO_ENABLED?.toLocaleLowerCase() ===
      'true'
        ? true
        : undefined;
    const listOfIdp = process.env.NEXT_PUBLIC_DROP_OFF_IDP?.split(',') || [];
    const isDropOffIdp = listOfIdp.includes(partnerId);
    return (isDropOffSSONeeded && isDropOffIdp) ?? false;
  };

  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {
    (async () => {
      if (!initialized.current) {
        initialized.current = true;
        let url: string = '';
        try {
          setIsError(false);
          if (isDropOffSSO(partnerId ?? '')) {
            const ref: string = await ssoDropOffToPing(
              ssoImpl != null ? ssoImpl : '',
            );

            url = buildDropOffSSOLink(partnerId ?? '', ref);
          } else {
            url = buildSSOLink(searchParams.toString());
          }
          const ssoWindow = window.open(url, '_blank');
          if (ssoWindow) {
            ssoWindow.onload = () => {
              if (ssoWindow.status === '500') {
                setIsError(true);
              }
            };
          }
          ssoWindow?.addEventListener('SSOError', () => {
            setIsError(true);
            ssoWindow?.close();
          });
        } catch (error) {
          console.log('catch block', error);
          setIsError(true);
        }
        setSSOUrl(url);
      }
    })();
  }, [partnerId, searchParams]);

  return (
    <main className="flex flex-col items-center page">
      <Column className="app-content app-base-font-color">
        <Link tabIndex={1} onClick={handleGoBack} href="#">
          <Image src={leftIcon} alt="back" className="inline" />
          <TextBox
            text="Go Back"
            display="inline"
            className="primary-color underline pt-1 inline"
          />
        </Link>
        <Spacer size={32} />
        {!isError ? (
          <>
            <Header className="title-1" text={`Taking you to ${sso}`} />
            <Spacer size={16} />
            <TextBox text="We’re about to send you off to our partner’s site, if you are not automatically redirected use the link below." />
          </>
        ) : (
          <>
            <Title className="title-1" text="Sorry, something went wrong." />
            <Spacer size={16} />
            <TextBox
              text={`There was a problem connecting you to ${sso}. Please try again using the link below or try again later.`}
            />
          </>
        )}
        <Spacer size={16} />
        <AppLink
          label={`Go to ${sso}`}
          target="_blank"
          icon={<Image src={externalIcon} alt="external" />}
          displayStyle="inline-flex"
          className="p-0"
          url={ssoUrl}
        />
      </Column>
    </main>
  );
};

export default LaunchSSO;
