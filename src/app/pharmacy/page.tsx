import { Metadata } from 'next';
import Pharmacy from '.';

export const metadata: Metadata = {
  title: 'Pharmacy Page',
};

const PharmacyPage = async () => {
  return <Pharmacy />;
};

export default PharmacyPage;
