'use server';
import { Metadata } from 'next';
import Dashboard from '.';
import { getDashboardData } from './actions/getDashboardData';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async () => {
  const result = await getDashboardData();
  return <Dashboard data={result.data!} />;
};

export default DashboardPage;
