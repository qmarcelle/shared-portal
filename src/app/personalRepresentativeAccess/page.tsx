import { auth } from '@/auth';
import { Metadata } from 'next';
import PersonalRepresentativeAccess from '.';

export const metadata: Metadata = {
  title: 'My Plan',
};

const PersonalRepresentativePage = async () => {
  const session = await auth();
  return (
    <PersonalRepresentativeAccess visibilityRules={session?.user.vRules} />
  );
};

export default PersonalRepresentativePage;
