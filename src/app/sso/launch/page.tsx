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
import { useEffect, useState } from 'react';
import buildSSOLink from '../actions/buildSSOPing';
import { SSO_TEXT_MAP } from '../ssoConstants';

const LaunchSSO = () => {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get('PartnerSpId');
  const [ssoUrl, setSSOUrl] = useState('');
  const [isError, setIsError] = useState(false);
  const sso = SSO_TEXT_MAP.get(partnerId ?? '');
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {
    const url = buildSSOLink(searchParams.toString());
    try {
      setIsError(false);
      const ssoWindow = window.open(url, '_blank');
      if (
        !ssoWindow ||
        ssoWindow?.closed ||
        typeof ssoWindow.closed == 'undefined'
      ) {
        setIsError(true);
      }
    } catch (error) {
      console.log('catch block', error);
      setIsError(true);
    }
    setSSOUrl(url);
  }, [partnerId, searchParams]);

  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Link tabIndex={1} onClick={handleGoBack} href="#">
          <Image src={leftIcon} alt="back" className="inline" />
          <TextBox
            text="Go Back"
            className="primary-color underline pt-1 inline"
          />
        </Link>
        <Spacer size={32} />
        {!isError ? (
          <>
            <Header className="title-1" text={`Taking you to [${sso}]`} />
            <Spacer size={16} />
            <TextBox text="We’re about to send you off to our partner’s site, if you are not automatically redirected use the link below." />
          </>
        ) : (
          <>
            <Title className="title-1" text="Sorry, something went wrong." />
            <Spacer size={16} />
            <TextBox
              text={`There was a problem connecting you to [${sso}]. Please try again using the link below or try again later.`}
            />
          </>
        )}
        <Spacer size={16} />
        <AppLink
          label={`Go to [${sso}]`}
          icon={<Image src={externalIcon} alt="external" />}
          displayStyle="inline-flex"
          className="p-0"
          url={ssoUrl}
        />
      </Column>
    </div>
  );
};

export default LaunchSSO;
