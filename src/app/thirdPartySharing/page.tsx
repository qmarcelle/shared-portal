import { auth } from '@/auth';
import { Metadata } from 'next';
import ThirdPartySharing from '.';

export const metadata: Metadata = {
  title: 'Third Party Sharing',
};

const ThirdPartySharingPage = async () => {
  const session = await auth();
  const isImpersonated = session!.user.impersonated;
  return <ThirdPartySharing isImpersonated={isImpersonated} />;
};

export default ThirdPartySharingPage;
