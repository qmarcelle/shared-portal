import { Metadata } from 'next';
import { getBenefitsData } from './actions/getBenefitsForMember';
import { loadUserData } from './actions/loadUserData';
import Benefits from './benefits';
import { BenefitsError } from './components/BenefitsError';

export const metadata: Metadata = {
  title: 'Benefits',
};

const BenefitsAndCoveragePage = async () => {
  const userInfoData = await loadUserData();
  if (userInfoData.status !== 200 || userInfoData.data === undefined) {
    return <BenefitsError />;
  }
  const firstMember = userInfoData.data?.members[0];
  const loadBenefitsData = await getBenefitsData(firstMember, 'A');
  if (loadBenefitsData.status !== 200 || loadBenefitsData.data === undefined) {
    return <BenefitsError />;
  }

  return (
    <Benefits
      memberInfo={userInfoData.data?.members}
      benefitsBean={loadBenefitsData.data}
    />
  );
};

export default BenefitsAndCoveragePage;
