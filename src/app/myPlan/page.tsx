import { getPremiumPayInfo } from '@/actions/premiumPayInfo';
import { auth } from '@/auth';
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

  return (
    <MyPlan
      data={result.data!}
      planData={planData.data!}
      contact={phoneNumber}
      payPremiumResponse={premiumPayResponse}
      visibilityRules={session?.user.vRules}
    />
  );
};

export default MyPlanPage;
