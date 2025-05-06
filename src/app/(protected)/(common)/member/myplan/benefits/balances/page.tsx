/**
 * benefits/balances
 * Balances
 */
export const metadata = {
  title: 'Balances | Consumer Portal',
  description: 'Balances'
};

export const dynamic = 'force-dynamic';

import { Balances } from '.';
import { getDedAndOOPBalanceForSubscriberAndDep } from './actions/getDedAndOOPBalance';

const BalancesPage = async () => {
  const balanceData = await getDedAndOOPBalanceForSubscriberAndDep();

  return <Balances data={balanceData.data} />;
};

export default BalancesPage;
