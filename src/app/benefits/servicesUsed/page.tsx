import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { Metadata } from 'next';
import ServicesUsed from '.';
import { getServicesUsedData } from './actions/getServicesUsedData';

export const metadata: Metadata = {
  title: 'Services Used',
};

const ServicesUsedPage = async () => {
  const result = await getServicesUsedData();
  const phoneNumber = await invokePhoneNumberAction();
  return (
    <ServicesUsed
      users={result.data?.members}
      services={result.data?.services}
      phoneNumber={phoneNumber}
    />
  );
};

export default ServicesUsedPage;
