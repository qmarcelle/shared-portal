import { Metadata } from 'next';
import ServicesUsed from '.';

export const metadata: Metadata = {
  title: 'ServicesUsed',
};

const ServicesUsedPage = async () => {
  return <ServicesUsed />;
};

export default ServicesUsedPage;
