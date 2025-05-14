import { Metadata } from 'next';
import PriceDentalCare from '.';
import { getNetworks } from './actions/getNetworks';
import { getProcedureCategories } from './actions/getProcedureCategories';

export const metadata: Metadata = {
  title: 'Price Dental Care',
};

const PriceDentalCarePage = async () => {
  const dentalNetworks = await getNetworks();
  const procCategories = await getProcedureCategories();
  return (
    <PriceDentalCare
      networks={dentalNetworks[0]?.networks}
      categories={procCategories[0]}
    />
  );
};

export default PriceDentalCarePage;
