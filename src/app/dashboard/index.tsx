'use client';

import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { UserRole } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { isWellnessQa } from '@/visibilityEngine/computeVisibilityRules';
import Link from 'next/link';
import MemberDashboard from './components/MemberDashboard';
import MemberDashboardTermedPlan from './components/MemberDashboardTermedPlan';
import NonMemberDashboard from './components/NonMemberDashboard';
import { PlanSelector } from './components/PlanSelector';
import { PlanSelectorErrorModal } from './components/PlanSelectorErrorModal';
import { WellnessDashboard } from './components/WellnessDasboard';
import { DashboardData } from './models/dashboardData';

export type DashboardProps = {
  data: DashboardData;
};

const Dashboard = ({ data }: DashboardProps) => {
  function getWelcomeText() {
    if ([UserRole.MEMBER, UserRole.NON_MEM].includes(data.role!)) {
      return 'Welcome, ';
    } else {
      return 'Viewing as ';
    }
  }

  if (data.memberDetails == null) {
    logger.info('Failure in rendering Dashboard data{}');
    return <PlanSelectorErrorModal />;
  }
  if (data.role != UserRole.NON_MEM && data.memberDetails?.planName == null) {
    return <PlanSelector plans={data.memberDetails!.plans!} />;
  }

  return (
    <div className="flex flex-col justify-center items-center page">
      <WelcomeBanner
        className="px-4"
        titleText={getWelcomeText()}
        name={toPascalCase(data.memberDetails?.firstName ?? '')}
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
            {data.memberDetails?.planName && (
              <Link href="/member/myplan" className="link-white-text">
                <p className="pb-2 pt-2">View Plan Details</p>
              </Link>
            )}
          </>
        }
      />
      <Spacer size={32}></Spacer>
      {data.role != UserRole.NON_MEM ? (
        <>
          {isWellnessQa(data.visibilityRules) ? (
            <WellnessDashboard />
          ) : !data.memberDetails?.selectedPlan?.termedPlan ? (
            <MemberDashboard data={data} />
          ) : (
            <MemberDashboardTermedPlan data={data} />
          )}
        </>
      ) : (
        <NonMemberDashboard profiles={data.profiles!} />
      )}
    </div>
  );
};

export default Dashboard;
