'use client'; //Page is client-side so it can invoke dxAuth() as a server action in order to sign in

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { inboundSSO } from '../actions/inbound';

const InboundSSODropOffPage = () => {
  const queryParams = useSearchParams();
  const refId = queryParams.get('refId');
  const targetResource = queryParams.get('TargetResource');
  const router = useRouter();
  const [msg, setMsg] = useState('Just a moment...');
  useEffect(() => {
    const sso = async () => {
      try {
        const pickup = await inboundSSO(refId, targetResource);
        if (pickup) {
          router.replace(
            /*pickup?.additionalProperties?.targetURL
            ? pickup?.additionalProperties.targetURL
            : */ targetResource
              ? decodeURIComponent(targetResource)
              : process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || '/dashboard',
          );
        }
      } catch (err) {
        setMsg("We weren't able to authenticate you. Taking you to the login page..."); //eslint-disable-line
        router.replace(
          targetResource ? `/login?TargetResource=${targetResource}` : '/login',
        );
      }
    };
    sso();
  });

  return <div>{msg}</div>;
};

export default InboundSSODropOffPage;
