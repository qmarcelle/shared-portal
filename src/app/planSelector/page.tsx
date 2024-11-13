import { Metadata } from 'next';
import PlanSelector from '.';

export const metadata: Metadata = {
  title: 'PlanSelector',
};

const PlanSelectorPage = async () => {
  return <PlanSelector />;
};

export default PlanSelectorPage;
