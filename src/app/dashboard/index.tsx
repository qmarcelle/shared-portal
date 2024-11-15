'use client';

import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { AlertBar } from '@/components/foundation/AlertBar';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Link from 'next/link';
import MemberDashboard from './components/MemberDashboard';
import NonMemberDashboard from './components/NonMemberDashboard';
import { DashboardData } from './models/dashboardData';
const isMemberDashboardVisible = true;

export type DashboardProps = {
  visibilityRules?: VisibilityRules;
  data: DashboardData;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Dashboard = ({ data, visibilityRules }: DashboardProps) => {
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
        name={data.username}
        minHeight="min-h-[250px]"
        body={
          <>
            <RichText
              spans={[
                <span key={0}>Plan: </span>,
                <span key={1} className="body-bold">
                  BlueCross BlueShield of Tennessee
                </span>,
              ]}
            />
            <Spacer size={8} />
            <RichText
              spans={[
                <span key={0}>Subscriber ID: </span>,
                <span key={1} className="body-bold">
                  ABC123456789
                </span>,
              ]}
            />
            <Spacer size={8} />
            <RichText
              spans={[
                <span key={0}>Group ID: </span>,
                <span key={1} className="body-bold">
                  B123456
                </span>,
              ]}
            />
            <Spacer size={8} />
            <RichText
              spans={[
                <span key={0}>Policies: </span>,
                <span key={1} className="body-bold">
                  Medical, Dental, Vision
                </span>,
              ]}
            />
            <Spacer size={16} />
            <Link href="/myPlan" className="link-white-text">
              <p className="pb-2 pt-2 body-bold">View Plan Details</p>
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
