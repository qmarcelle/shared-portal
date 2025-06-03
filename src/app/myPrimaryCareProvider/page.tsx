import { Metadata } from 'next';
import PrimaryCareOptions from '.';
import { invokePhoneNumberAction } from '../profileSettings/actions/profileSettingsAction';
import { getPrimaryCareOptionsData } from './actions/getPrimaryCareOptionsData';

export const metadata: Metadata = {
  title: 'Primary Care Options',
};

const PrimaryCareOptionsPage = async () => {
  const result = await getPrimaryCareOptionsData();
  const phoneNumber = await invokePhoneNumberAction();
  return <PrimaryCareOptions data={result.data!} phone={phoneNumber} />;
};

export default PrimaryCareOptionsPage;
