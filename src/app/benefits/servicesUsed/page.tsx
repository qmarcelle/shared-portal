import { Metadata } from 'next';
import ServicesUsed from '.';
import { getServicesUsedData } from './actions/getServicesUsedData';

export const metadata: Metadata = {
  title: 'Services Used',
};

const ServicesUsedPage = async () => {
  const result = await getServicesUsedData();
  return (
    <ServicesUsed
      users={result.data?.members}
      services={result.data?.services}
    />
  );
};

export default ServicesUsedPage;
