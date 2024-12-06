import { Metadata } from 'next';
import PlanDocuments from '.';
import { getPlanDocuments } from './actions/getPlanDocuments';

export const metadata: Metadata = {
  title: 'Plan Documents',
};

const PlanDocumentsPage = async () => {
  const result = await getPlanDocuments();
  return <PlanDocuments data={result.data!} />;
};

export default PlanDocumentsPage;
