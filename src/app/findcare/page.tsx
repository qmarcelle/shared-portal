import { Metadata } from 'next';
import FindCare from '.';

export const metadata: Metadata = {
  title: 'FindCare',
};

const FindCarePage = async () => {
  return <FindCare />;
};

export default FindCarePage;
