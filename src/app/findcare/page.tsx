import { auth } from '@/auth';
import { Metadata } from 'next';
import { Session } from 'next-auth';
import FindCare from '.';

export const metadata: Metadata = {
  title: 'FindCare',
};

const FindCarePage = async () => {
  const session: Session | null = await auth();
  return <FindCare visibilityRules={session?.user.vRules} />;
};

export default FindCarePage;
