'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import postToPing from '../actions/postToPing';

/**
 * SSO Redirect component that handles redirecting to partner sites
 * with the appropriate reference ID
 */
const SSORedirect = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get connection ID from search params
  const connectionId = decodeURIComponent(
    searchParams.get('connectionId') ?? '',
  );

  // Get the provider implementation name
  const providerId = connectionId || '';

  // Convert search params to object for POST request
  const paramsObject = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    const sendSSO = async () => {
      try {
        console.log('Initiating SSO redirect process');

        // Post to Ping to get the reference ID
        const ref: string = await postToPing(providerId, paramsObject);

        // Get and sanitize the resume path
        const resumePath = decodeURIComponent(
          searchParams.get('resumePath') ?? '',
        );
        const sanitizedResumePath = resumePath.replace(/[\n\r\t]/g, '_');

        // Build the final URL
        const url = `${process.env.NEXT_PUBLIC_PING_REST_URL}${sanitizedResumePath}?REF=${ref}`;

        // Redirect to the final URL
        router.push(url);
      } catch (error) {
        // Dispatch error event for parent window to handle
        window.dispatchEvent(
          new CustomEvent('SSOError', { detail: 'Error in SSO redirect' }),
        );
        console.error('Error in SSO redirect:', error);
      }
    };

    if (providerId) {
      sendSSO();
    } else {
      console.error('No connection ID provided for SSO redirect');
      window.dispatchEvent(
        new CustomEvent('SSOError', { detail: 'Invalid connection ID' }),
      );
    }
  }, [searchParams, router, providerId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
      <p className="text-gray-600">
        Please wait while we connect you to the service.
      </p>
    </div>
  );
};

export default SSORedirect;
