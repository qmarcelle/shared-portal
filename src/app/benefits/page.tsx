import { Metadata } from 'next';
import Benefits from '.';

export const metadata: Metadata = {
  title: 'Benefits',
};

const BenefitsAndCoveragePage = async () => {
  return <Benefits />;
};

export default BenefitsAndCoveragePage;
