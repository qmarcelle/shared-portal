'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import postToPing from '../actions/postToPing';
import { SSO_IMPL_MAP } from '../ssoConstants';

const SSORedirect = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const connectionId = decodeURIComponent(
    searchParams.get('connectionId') ?? '',
  );
  const ssoImpl =
    connectionId != null ? SSO_IMPL_MAP.get(connectionId) : 'Not Found';
  console.log(ssoImpl + ' PAGE !!!');
  const paramsObject = Object.fromEntries(searchParams.entries());
  useEffect(() => {
    const sendSSO = async () => {
      try {
        console.log('Entered Send SSO !!!!');
        // Pass the object directly to postToPing
        const ref: string = await postToPing(
          ssoImpl != null ? ssoImpl : '',
          paramsObject,
        );

        const resumePath = decodeURIComponent(
          searchParams.get('resumePath') ?? '',
        );

        const sanitizedResumePath =
          resumePath != null
            ? resumePath.replace(/[\n\r\t]/g, '_')
            : resumePath;
        const url = `${process.env.NEXT_PUBLIC_PING_REST_URL}${sanitizedResumePath}?REF=${ref}`;

        router.push(url);
      } catch (error) {
        console.error('Error in sendSSO:', error);
      }
    };

    sendSSO();
  }, [searchParams, router, ssoImpl]);

  return 'We are taking you to SSO page';
};

export default SSORedirect;
