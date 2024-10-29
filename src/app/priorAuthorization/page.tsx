import { Metadata } from 'next';
import PriorAuthorization from '.';
import { getPriorAuthData } from './actions/getPriorAuthData';

export const metadata: Metadata = {
  title: 'Prior Authorization',
};

const PriorAuthorizationPage = async () => {
  const result = await getPriorAuthData();
  return <PriorAuthorization data={result.data!} />;
};

export default PriorAuthorizationPage;
