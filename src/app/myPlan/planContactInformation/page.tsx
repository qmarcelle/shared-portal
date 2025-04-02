import { Metadata } from 'next';
import PlanContactInformation from '.';
import { getAllPlansData } from '../actions/getAllPlansData';

export const metadata: Metadata = {
  title: 'PlanContactInformation',
};

const PlanContactInformationPage = async () => {
  const [planData] = await Promise.all([getAllPlansData()]);
  return (
    <main className="flex flex-col justify-center items-center page">
      <PlanContactInformation planData={planData.data!} />
    </main>
  );
};

export default PlanContactInformationPage;
