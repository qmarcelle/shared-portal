/**
 * benefits/details
 * Details
 */
export const metadata = {
  title: 'Details | Consumer Portal',
  description: 'Details'
};

import { getDedAndOOPBalanceForSubscriberAndDep } from '../balances/actions/getDedAndOOPBalance';
import { Details } from './details';

const BenefitDetailsPage = async () => {
  const spendingAccounts = {
    linkURL: '/spending-accounts',
    hsaBalance: 1000,
    fsaBalance: 500,
    className: 'm-2 mt-4 p-8',
  };
  const balanceData = await getDedAndOOPBalanceForSubscriberAndDep();
  return (
    <Details
      balanceData={balanceData.data}
      spendingAccountInfo={spendingAccounts}
    />
  );
};

export default BenefitDetailsPage;
