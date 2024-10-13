'use client';

import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { AlertBar } from '@/components/foundation/AlertBar';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Link from 'next/link';
import MemberDashboard from './components/MemberDashboard';
import NonMemberDashboard from './components/NonMemberDashboard';
const isMemberDashboardVisible = true;

const Dashboard = () => {
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
        name="James Kilney"
        minHeight="min-h-[250px]"
        body={
          <>
            <TextBox text="Plan: BlueCross BlueShield of Tennessee" />
            <Spacer size={8} />
            <TextBox text="Subscriber ID: ABC123456789" />
            <Spacer size={8} />
            <TextBox text="Group ID: 123456" />
            <Spacer size={8} />
            <TextBox text="Policies: Medical, Dental, Vision" />
            <Spacer size={16} />
            <Link href="/myPlan" className="link-white-text">
              <p className="pb-2 pt-2">View Plan Details</p>
            </Link>
          </>
        }
      />
      <Spacer size={32}></Spacer>
      {isMemberDashboardVisible ? <MemberDashboard /> : <NonMemberDashboard />}
    </div>
  );
};

export default Dashboard;
