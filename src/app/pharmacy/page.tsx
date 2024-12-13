import { Metadata } from 'next';
import Pharmacy from '.';
import { getFormularyDetails } from './actions/getFormularyDetails';

export const metadata: Metadata = {
  title: 'Pharmacy Page',
};

const PharmacyPage = async () => {
  const componentURL = await getFormularyDetails();
  return <Pharmacy data={componentURL} />;
};

export default PharmacyPage;
