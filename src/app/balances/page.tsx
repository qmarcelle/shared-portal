import { BalancesPage } from '.';
import { getDedAndOOPBalanceForSubscriberAndDep } from './actions/getDedAndOOPBalance';

const Page = async () => {
  const balanceData = await getDedAndOOPBalanceForSubscriberAndDep();
  console.log(balanceData.data?.medical);
  return <BalancesPage data={balanceData.data!} />;
};

export default Page;
