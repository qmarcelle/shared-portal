'use client';

import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { AlertBar } from '@/components/foundation/AlertBar';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Link from 'next/link';
import MemberDashboard from './components/MemberDashboard';
import NonMemberDashboard from './components/NonMemberDashboard';
import { DashboardData } from './models/dashboardData';

export type DashboardProps = {
  data: DashboardData;
};

const Dashboard = ({ data }: DashboardProps) => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <AlertBar
        alerts={[
          'There is a planned system outage on July 23-25',
          'Another type of message that effects',
        ]}
      />
      <WelcomeBanner
        className="px-4"
        titleText="Welcome, "
        name={data.currentUser.currUsr?.firstName}
        minHeight="min-h-[250px]"
        body={
          <>
            <TextBox
              text={`Plan: ${data.currentUser.currUsr?.plan?.planName}`}
            />
            <Spacer size={8} />
            <TextBox
              text={`Subscriber ID: ${data.currentUser.currUsr?.plan?.subId}`}
            />
            <Spacer size={8} />
            <TextBox
              text={`Group ID: ${data.currentUser.currUsr?.plan?.grpId}`}
            />
            <Spacer size={8} />
            <TextBox
              text={`Policies: ${data.currentUser.currUsr?.plan?.coverageType?.join(', ')}`}
            />
            <Spacer size={16} />
            <Link href="/myPlan" className="link-white-text">
              <p className="pb-2 pt-2">View Plan Details</p>
            </Link>
          </>
        }
      />
      <Spacer size={32}></Spacer>
      {!data.currentUser.vRules?.nonMemberDashboard ? (
        <MemberDashboard visibilityRules={data.currentUser.vRules} />
      ) : (
        <NonMemberDashboard />
      )}
    </div>
  );
};

export default Dashboard;
