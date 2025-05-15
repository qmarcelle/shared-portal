import { Metadata } from 'next';
import MyPlan from '.';
import { invokePhoneNumberAction } from '../profileSettings/actions/profileSettingsAction';
import { getAllPlansData } from './actions/getAllPlansData';
import { getMyPlanData } from './actions/getMyPlanData';

export const metadata: Metadata = {
  title: 'My Plan',
};

const MyPlanPage = async () => {
  const phoneNumber = await invokePhoneNumberAction();
  const [result, planData] = await Promise.all([
    getMyPlanData(),
    getAllPlansData(),
  ]);
  return (
    <MyPlan
      data={result.data!}
      planData={planData.data!}
      contact={phoneNumber}
    />
  );
};

export default MyPlanPage;
