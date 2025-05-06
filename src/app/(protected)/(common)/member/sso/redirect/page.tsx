import { Metadata } from 'next';
import { SSORedirectClient } from '@/components/SSORedirectClient';

export const metadata: Metadata = {
  title: 'SSO Redirect - Health Portal',
  description: 'Processing SSO redirect',
};

// Server Component
export default async function SSORedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const connectionId = searchParams['connectionId'] as string;
  if (!connectionId) {
    throw new Error('Missing connectionId parameter');
  }

  return (
    <SSORedirectClient
      connectionId={decodeURIComponent(connectionId)}
      searchParams={searchParams}
    />
  );
}
