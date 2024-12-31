import { Metadata } from 'next';
import Benefits from '.';
import { getBenefits } from './actions/getBenefits';

export const metadata: Metadata = {
  title: 'Benefits',
};

const BenefitsAndCoveragePage = async () => {
  const balanceData = await getBenefits();
  return <Benefits data={balanceData.data} />;
};

export default BenefitsAndCoveragePage;
