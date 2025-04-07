export const dynamic = 'force-dynamic';

import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { Balances } from '.';
import { getDedAndOOPBalanceForSubscriberAndDep } from './actions/getDedAndOOPBalance';

const BalancesPage = async () => {
  const phoneNumber = await invokePhoneNumberAction();
  const balanceData = await getDedAndOOPBalanceForSubscriberAndDep();

  return <Balances data={balanceData.data} phoneNumber={phoneNumber} />;
};

export default BalancesPage;
