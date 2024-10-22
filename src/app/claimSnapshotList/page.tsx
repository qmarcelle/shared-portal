import { Metadata } from 'next';
import ClaimsSnapshot from '.';

export const metadata: Metadata = {
  title: 'ClaimsSnapshot',
};

const MyClaimsPage = async () => {
  return <ClaimsSnapshot />;
};

export default MyClaimsPage;
