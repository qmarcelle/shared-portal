import { Metadata } from 'next';
import {
  getBenefitTypes,
  getMemberDropdownValues,
} from './actions/benefitsUtils';
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
      benefitsBean={loadBenefitsData.data}
      benefitsTypes={getBenefitTypes(firstMember.planDetails)}
      memberDropdownValues={getMemberDropdownValues(userInfoData.data?.members)}
    />
  );
};

export default BenefitsAndCoveragePage;

// const onMemberSelectionChange = (selectedMember: string) => {
//   setSelectedMember(selectedMember);
//   setMemberIndex(parseInt(selectedMember));
//   const selectedMemberPlanDetails =
//     userInfo.members[parseInt(selectedMember)].planDetails;

//   setBenefitTypes(getBenefitTypes(selectedMemberPlanDetails));
// };

// const fetchInitialData = async () => {
//   // load userInfo from service

//   setUserInfo(userInfoData);
//   const memberDropdowns = getMemberDropdownValues(userInfoData.members);
//   console.log(memberDropdowns);
//   setMemberDropDownValues(memberDropdowns);
//   onMemberSelectionChange(selectedMember);
//   const response = await getBenefitsData(
//     userInfoData.members[0],
//     selectedBenefitType,
//   );
//   if (response.status === 200) {
//     console.log('Successful response from service');
//     if (response.data && response.data.memberCk > 0) {
//       setCurrentUserBenefitData(response.data);
//       setMedicalBenefitsFromResponse(response.data);
//     } else {
//       console.log('Error response from service');
//     }
//   }
// };
// fetchInitialData();
