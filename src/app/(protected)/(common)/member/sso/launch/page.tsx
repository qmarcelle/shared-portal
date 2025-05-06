import { Metadata } from 'next';
import { SSOLaunchClient } from '@/components/SSOLaunchClient';

export const metadata: Metadata = {
  title: 'SSO Launch - Health Portal',
  description: 'Launching SSO authentication',
};

// Server Component
export default async function SSOLaunchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const partnerId = searchParams['PartnerSpId'] as string;
  const alternateSSOText = searchParams['alternateText'] as string;

  if (!partnerId) {
    throw new Error('Missing PartnerSpId parameter');
  }

  return (
    <SSOLaunchClient
      partnerId={partnerId}
      alternateSSOText={alternateSSOText}
    />
  );
}
