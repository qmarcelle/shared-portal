import { Metadata } from 'next';
import MyPlan from '.';
import { getMyPlanData } from './actions/getMyPlanData';

export const metadata: Metadata = {
  title: 'My Plan',
};

const MyPlanPage = async () => {
  const result = await getMyPlanData();
  return <MyPlan data={result.data!} />;
};

export default MyPlanPage;
