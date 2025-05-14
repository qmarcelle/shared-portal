import { getFormularyDetails } from '@/app/pharmacy/actions/getFormularyDetails';
import { Metadata } from 'next';
import PlanDocuments from '.';
import { getPlanDocuments } from './actions/getPlanDocuments';

export const metadata: Metadata = {
  title: 'Plan Documents',
};

const PlanDocumentsPage = async () => {
  const result = await getPlanDocuments();
  const formularyDetails = await getFormularyDetails();

  return (
    <PlanDocuments
      data={result.data!}
      formularyURL={formularyDetails.data?.formularyURL ?? ''}
    />
  );
};

export default PlanDocumentsPage;
