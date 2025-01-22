import { Metadata } from 'next';
import Pharmacy from '.';
import { getFormularyDetails } from './actions/getFormularyDetails';

export const metadata: Metadata = {
  title: 'Pharmacy Page',
};

const PharmacyPage = async () => {
  const result = await getFormularyDetails();
  return <Pharmacy data={result.data!} />;
};

export default PharmacyPage;
