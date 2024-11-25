import { getDedAndOOPBalanceForSubscriberAndDep } from '../balances/actions/getDedAndOOPBalance';
import { Details } from './details';

const BenefitDetailsPage = async () => {
  const spendingAccounts = {
    linkURL: '/spending-accounts',
    hsaBalance: 1000,
    fsaBalance: 500,
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
