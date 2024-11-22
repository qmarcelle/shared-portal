import { Metadata } from 'next';
import Support from '.';
import { getSupportData } from './actions/getSupportData';

export const metadata: Metadata = {
  title: 'Support',
};

const SupportPage = async () => {
  const result = await getSupportData();
  return <Support data={result.data!} />;
};

export default SupportPage;
