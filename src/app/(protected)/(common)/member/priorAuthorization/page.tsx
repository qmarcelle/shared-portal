import { Metadata } from 'next';
import PriorAuthorization from '.';
import { getInitialPriorAuthFilter } from './actions/getInitialFilter';
import { getPriorAuthData } from './actions/getPriorAuthData';

export const metadata: Metadata = {
  title: 'Prior Authorization',
};

const PriorAuthorizationPage = async () => {
  const result = await getPriorAuthData();
  return (
    <PriorAuthorization
      data={result.data!}
      initialFilters={getInitialPriorAuthFilter()}
    />
  );
};

export default PriorAuthorizationPage;
