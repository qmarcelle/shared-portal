'use client';

import { SearchNavigation } from '@/components/composite/SearchNavigation';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { AlertBar } from '@/components/foundation/AlertBar';
import { Spacer } from '@/components/foundation/Spacer';
import NonMemberDashboard from './components/NonMemberDashboard';

const Dashboard = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <AlertBar
        alerts={[
          'There is a planned system outage on July 23-25',
          'Another type of message that effects',
        ]}
      />
      <SearchNavigation className="px-4"></SearchNavigation>
      <WelcomeBanner
        className="px-4"
        titleText="Welcome, "
        name="James Kilney"
        body={
          <>
            <p className="body-1">Subscriber Id : AC56543456</p>
            <p className="body-1">Group No. : 876765</p>
          </>
        }
      />
      <Spacer size={32}></Spacer>
      <NonMemberDashboard />
      {/* <NonMemberDashboard /> */}
    </div>
  );
};

export default Dashboard;
