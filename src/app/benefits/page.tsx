import { Metadata } from 'next';
import loadBenefits from './actions/loadBenefits';
import { loadUserData } from './actions/loadUserData';
import Benefits from './benefits';
import { BenefitsError } from './components/BenefitsError';
import { Session } from 'next-auth';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Benefits',
};

const BenefitsAndCoveragePage = async () => {
  const session: Session | null = await auth();
  const userInfoData = await loadUserData(session);
  if (userInfoData.status !== 200 || userInfoData.data === undefined) {
    return <BenefitsError />;
  }
  const firstMember = userInfoData.data?.members[0];
  const loadBenefitsData = await loadBenefits(firstMember);
  if (loadBenefitsData.status !== 200 || loadBenefitsData.data === undefined) {
    return <BenefitsError />;
  }

  return (
    <Benefits
      user={session?.user}
      memberInfo={userInfoData.data?.members}
      benefitsBean={loadBenefitsData.data}
    />
  );
};

export default BenefitsAndCoveragePage;
