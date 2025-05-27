import { getPremiumPayInfo } from '@/actions/premiumPayInfo';
import { auth } from '@/auth';
import { Metadata } from 'next';
import Dashboard from '.';
import { getDashboardData } from './actions/getDashboardData';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async () => {
  const session = await auth();
  const [result, premiumPayResponse] = await Promise.all([
    getDashboardData(),
    getPremiumPayInfo(session?.user.currUsr.plan?.memCk ?? ''),
  ]);

  const dashboardData = {
    ...result.data!,
    premiumPayResponse,
  };

  return <Dashboard data={dashboardData} />;
};

export default DashboardPage;
