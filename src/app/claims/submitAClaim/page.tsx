import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { Metadata } from 'next';
import SubmitClaim from '.';

export const metadata: Metadata = {
  title: 'Submit a claim',
};

const SubmitAClaimPage = async () => {
  const phoneNumber = await invokePhoneNumberAction();
  return <SubmitClaim phone={phoneNumber} />;
};

export default SubmitAClaimPage;
