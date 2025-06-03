import { Metadata } from 'next';
import Dashboard from '.';
import { getDashboardData } from './actions/getDashboardData';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async () => {
  console.log('[DashboardPage] Starting to fetch dashboard data');
  const result = await getDashboardData();
  console.log('[DashboardPage] Dashboard data fetched', {
    hasData: !!result.data,
    hasMemberDetails: !!result.data?.memberDetails,
    memberDetailsProps: result.data?.memberDetails
      ? Object.keys(result.data.memberDetails)
      : [],
    hasPlans: !!result.data?.memberDetails?.plans,
    plansLength: result.data?.memberDetails?.plans?.length,
    timestamp: new Date().toISOString(),
  });

  const memberDetails = result.data?.memberDetails;

  console.log('[DashboardPage] Rendering Dashboard component', {
    hasData: !!result.data,
    timestamp: new Date().toISOString(),
  });

  return <Dashboard data={result.data!} />;
};

export default DashboardPage;
