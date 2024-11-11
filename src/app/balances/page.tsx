import { auth } from '@/auth';
import { BalancesPage } from '.';

const Page = async () => {
  const session = await auth();
  return <BalancesPage />;
};

export default Page;
