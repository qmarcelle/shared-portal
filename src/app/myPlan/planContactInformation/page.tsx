import { Metadata } from 'next';
import PlanContactInformation from '.';

export const metadata: Metadata = {
  title: 'PlanContactInformation',
};

const PlanContactInformationPage = async () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <PlanContactInformation />
    </main>
  );
};

export default PlanContactInformationPage;
