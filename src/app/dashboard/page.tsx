import { auth } from '@/auth';
import { Metadata } from 'next';
import Dashboard from '.';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async () => {
  const session = await auth();
  return session?.user && <Dashboard data={{ currentUser: session?.user }} />;
};

export default DashboardPage;
