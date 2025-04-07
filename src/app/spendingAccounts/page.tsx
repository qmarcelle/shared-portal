import { Metadata } from 'next';
import SpendingAccount from '.';
import { invokePhoneNumberAction } from '../profileSettings/actions/profileSettingsAction';

export const metadata: Metadata = {
  title: 'Spending Accounts',
};

const SpendingAccountPage = async () => {
  const phoneNumber = await invokePhoneNumberAction();
  return <SpendingAccount contact={phoneNumber} />;
};

export default SpendingAccountPage;
