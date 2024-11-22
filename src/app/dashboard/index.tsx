'use client';

import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { AlertBar } from '@/components/foundation/AlertBar';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { UserRole } from '@/userManagement/models/sessionUser';
import { toPascalCase } from '@/utils/pascale_case_formatter';
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
        name={toPascalCase(data.memberDetails?.firstName ?? '')}
        minHeight="min-h-[250px]"
        body={
          <>
            {data.memberDetails?.planName && (
              <>
                <TextBox text={`Plan: ${data.memberDetails?.planName}`} />
                <Spacer size={8} />
              </>
            )}
            {data.memberDetails?.subscriberId && (
              <>
                <TextBox
                  text={`Subscriber ID: ${data.memberDetails?.subscriberId}`}
                />
                <Spacer size={8} />
              </>
            )}
            {data.memberDetails?.groupId && (
              <>
                <TextBox text={`Group ID: ${data.memberDetails?.groupId}`} />
                <Spacer size={8} />
              </>
            )}
            {data.memberDetails?.coverageType?.length && (
              <>
                <TextBox
                  text={`Policies: ${data.memberDetails?.coverageType?.join(', ')}`}
                />
                <Spacer size={16} />
              </>
            )}
            <Link href="/myPlan" className="link-white-text">
              <p className="pb-2 pt-2">View Plan Details</p>
            </Link>
          </>
        }
      />
      <Spacer size={32}></Spacer>
      {data.role == UserRole.MEMBER ? (
        <MemberDashboard visibilityRules={data.visibilityRules} />
      ) : (
        <NonMemberDashboard />
      )}
    </div>
  );
};

export default Dashboard;
