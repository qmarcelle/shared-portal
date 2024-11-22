import { Metadata } from 'next';
import { getBenefitsData } from './actions/getBenefitsForMember';
import { loadUserData } from './actions/loadUserData';
import Benefits from './benefits';

export const metadata: Metadata = {
  title: 'Benefits',
};

// const {
//   currentUserBenefitData,
//   setCurrentUserBenefitData,
//   userInfo,
//   setUserInfo,
//   memberIndex,
//   setMemberIndex,
//   setSelectedBenefitCategory,
//   setSelectedBenefitsBean,
// } = useBenefitsStore();

const BenefitsAndCoveragePage = async () => {
  // const [selectedMember, setSelectedMember] = useState<string>('0');
  // const selectedBenefitType = 'M';

  // const [memberDropdownValues, setMemberDropDownValues] = useState<
  //   { label: string; value: string; id: string }[]
  // >([]);

  const userInfoData = await loadUserData();
  const firstMember = userInfoData.data?.members[0];
  if (userInfoData.data === undefined || firstMember === undefined) {
    return <div>Something went wrong...</div>;
  }
  const loadBenefitsData = await getBenefitsData(firstMember, 'A');
  if (loadBenefitsData.status !== 200 || loadBenefitsData.data === undefined) {
    return <div>Something went wrong...</div>;
  }

  return (
    <Benefits
      memberInfo={userInfoData.data?.members}
      benefitsBean={loadBenefitsData.data}
    />
  );
};

export default BenefitsAndCoveragePage;
