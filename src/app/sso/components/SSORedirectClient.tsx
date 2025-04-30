'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import postToPing from '../actions/postToPing';
import { SSO_IMPL_MAP } from '../ssoConstants';

interface SSORedirectClientProps {
  connectionId: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export function SSORedirectClient({
  connectionId,
  searchParams,
}: SSORedirectClientProps) {
  const router = useRouter();
  const ssoImpl = SSO_IMPL_MAP.get(connectionId) ?? 'Not Found';

  useEffect(() => {
    const sendSSO = async () => {
      try {
        console.log('Entered Send SSO !!!!');
        // Convert searchParams to expected format
        const params: { [key: string]: string } = {};
        Object.entries(searchParams).forEach(([key, value]) => {
          if (typeof value === 'string') {
            params[key] = value;
          } else if (Array.isArray(value)) {
            params[key] = value[0] ?? '';
          }
        });

        const ref: string = await postToPing(ssoImpl, params);

        const resumePath = searchParams['resumePath'] as string;
        const sanitizedResumePath = resumePath?.replace(/[\n\r\t]/g, '_') ?? '';
        const url = `${process.env.NEXT_PUBLIC_PING_REST_URL}${sanitizedResumePath}?REF=${ref}`;

        router.push(url);
      } catch (error) {
        window.dispatchEvent(
          new CustomEvent('SSOError', { detail: 'Error in SSO' }),
        );
        console.error('Error in sendSSO:', error);
        // Redirect to error page on failure
        router.push('/error?code=sso_error');
      }
    };

    sendSSO();
  }, [connectionId, router, searchParams, ssoImpl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Processing SSO Request</h1>
        <p className="text-gray-600">Please wait while we redirect you...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
