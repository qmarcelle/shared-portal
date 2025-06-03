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
import { SSOService, URLService } from '..';

/**
 * Component for launching SSO to partner sites
 */
const LaunchSSO = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialized = useRef(false);

  // Get parameters from the URL
  const partnerId = searchParams.get('PartnerSpId') || '';
  const alternateText = searchParams.get('alternateText') || undefined;

  // Component state
  const [ssoUrl, setSSOUrl] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the display name for the provider
  const providerName = alternateText
    ? decodeURIComponent(alternateText)
    : SSOService.getProviderName(partnerId);

  // Convert searchParams to a string and object representation
  const searchParamsString = searchParams.toString();
  const searchParamsObj = Object.fromEntries(searchParams.entries());

  // Handle going back
  const handleGoBack = () => {
    router.back();
  };

  // Effect to initialize the SSO flow
  useEffect(() => {
    const initSSO = async () => {
      if (!initialized.current && partnerId) {
        initialized.current = true;
        setIsLoading(true);

        try {
          // Generate the SSO URL using the URLService
          const url = await URLService.generateSSOUrl(
            partnerId,
            searchParamsString,
            searchParamsObj,
          );

          // Open the SSO URL in a new window
          const ssoWindow = window.open(url, '_blank');

          // Handle errors
          if (ssoWindow) {
            ssoWindow.onload = () => {
              if (ssoWindow.status === '500') {
                setIsError(true);
              }
            };

            ssoWindow.addEventListener('SSOError', () => {
              setIsError(true);
              ssoWindow.close();
            });
          }

          // Store the URL for the manual link
          setSSOUrl(url);
        } catch (error) {
          console.error('SSO initialization failed', error);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initSSO();
  }, [partnerId, searchParamsString, searchParamsObj]);

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

        {isLoading ? (
          <Header className="title-1" text="Preparing your connection..." />
        ) : !isError ? (
          <>
            <Header
              className="title-1"
              text={`Taking you to ${providerName}`}
            />
            <Spacer size={16} />
            <TextBox text="We're about to send you off to our partner's site. If you are not automatically redirected, use the link below." />
          </>
        ) : (
          <>
            <Title className="title-1" text="Sorry, something went wrong." />
            <Spacer size={16} />
            <TextBox
              text={`There was a problem connecting you to ${providerName}. Please try again using the link below or try again later.`}
            />
          </>
        )}

        <Spacer size={16} />
        {ssoUrl && (
          <AppLink
            label={`Go to ${providerName}`}
            target="_blank"
            icon={<Image src={externalIcon} alt="external" />}
            displayStyle="inline-flex"
            className="p-0"
            url={ssoUrl}
          />
        )}
      </Column>
    </main>
  );
};

export default LaunchSSO;
