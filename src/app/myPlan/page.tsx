import { getPremiumPayInfo } from '@/actions/premiumPayInfo';
import { auth } from '@/auth';
import {
  isBlueCareEligible,
  isPayMyPremiumEligible,
  isQuantumHealthEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { Metadata } from 'next';
import MyPlan from '.';
import { invokePhoneNumberAction } from '../profileSettings/actions/profileSettingsAction';
import { getAllPlansData } from './actions/getAllPlansData';
import { getMyPlanData } from './actions/getMyPlanData';

export const metadata: Metadata = {
  title: 'My Plan',
};

const MyPlanPage = async () => {
  const session = await auth();
  const phoneNumber = await invokePhoneNumberAction();
  const [result, planData, premiumPayResponse] = await Promise.all([
    getMyPlanData(),
    getAllPlansData(),
    getPremiumPayInfo(session?.user.currUsr.plan?.memCk ?? ''),
  ]);

  // Evaluate visibility rules on server-side
  const visibilityRules = result.data?.visibilityRules;
  const isQuantumHealthEligibleResult =
    isQuantumHealthEligible(visibilityRules);
  const isPayMyPremiumEligibleResult = isPayMyPremiumEligible(visibilityRules);
  const isBlueCareEligibleResult = isBlueCareEligible(visibilityRules);

  return (
    <MyPlan
      data={result.data!}
      planData={planData.data!}
      contact={phoneNumber}
      payPremiumResponse={premiumPayResponse}
      isQuantumHealthEligible={isQuantumHealthEligibleResult}
      isPayMyPremiumEligible={isPayMyPremiumEligibleResult}
      isBlueCareEligible={isBlueCareEligibleResult}
    />
  );
};

export default MyPlanPage;
