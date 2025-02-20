import { Metadata } from 'next';
import PrimaryCareOptions from '.';
import { getPrimaryCareOptionsData } from './actions/getPrimaryCareOptionsData';

export const metadata: Metadata = {
  title: 'Primary Care Options',
};

const PrimaryCareOptionsPage = async () => {
  const result = await getPrimaryCareOptionsData();
  return <PrimaryCareOptions data={result.data!} />;
};

export default PrimaryCareOptionsPage;
