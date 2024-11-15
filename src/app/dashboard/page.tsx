import { Metadata } from 'next';
import Dashboard from '.';

export const metadata: Metadata = {
  title: 'DashBoard Page',
};

const DashboardPage = async () => {
  return (
    <Dashboard
      visibilityRules={undefined}
      data={{
        username: 'James Kilney',
      }}
    />
  );
};

export default DashboardPage;
