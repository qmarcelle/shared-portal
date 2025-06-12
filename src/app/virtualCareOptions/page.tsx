import { auth } from '@/auth';
import { Metadata } from 'next';
import VirtualCareOptions from '.';

export const metadata: Metadata = {
  title: 'VirtualCareOptions',
};

const VirtualCareOptionsPage = async () => {
  const session = await auth();
  return <VirtualCareOptions visibilityRules={session?.user.vRules} />;
};

export default VirtualCareOptionsPage;
