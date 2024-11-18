export const dynamic = 'force-dynamic';

import { Balances } from '.';
import { getDedAndOOPBalanceForSubscriberAndDep } from './actions/getDedAndOOPBalance';

const BalancesPage = async () => {
  const balanceData = await getDedAndOOPBalanceForSubscriberAndDep();
  console.log(balanceData.data?.medical);
  return <Balances data={balanceData.data} />;
};

export default BalancesPage;
