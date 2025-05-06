'use client';

import { SpendingAccountSummary } from '@/app/(protected)/(common)/member/dashboard/components/SpendingAccountSummary';
import { RecentClaimSection } from '@/components/composite/RecentClaimSection';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { DashboardData } from '../models/dashboardData';

export type DashboardProps = {
  data: DashboardData;
};

const MemberDashboardTermedPlan = ({}: DashboardProps) => {
  return (
    <div className="flex flex-col w-full justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <RecentClaimSection
              className="large-section"
              title="Recent Claims"
              linkText="View Claims"
              claims={[
                {
                  id: 'Claim98',
                  claimStatus: 'Processed',
                  claimType: 'Medical',
                  claimTotal: '67',
                  issuer: 'John Doe',
                  memberName: 'Chris James',
                  serviceDate: '02/06/2024',
                  isMiniCard: true,
                  claimInfo: {},
                  memberId: '04',
                  claimStatusCode: 2,
                },
                {
                  id: 'Claim76',
                  claimStatus: 'Pending',
                  claimType: 'Pharmacy',
                  claimTotal: '30.24',
                  issuer: 'John Doe',
                  memberName: 'Aly Jame',
                  serviceDate: '01/06/2024',
                  claimInfo: {},
                  isMiniCard: true,
                  memberId: '03',
                  claimStatusCode: 2,
                },
                {
                  id: 'Claim54',
                  claimStatus: 'Denied',
                  claimType: 'Dental',
                  claimTotal: '65.61',
                  issuer: 'John Doe',
                  memberName: 'Aly Jame',
                  serviceDate: '01/16/2024',
                  claimInfo: {},
                  isMiniCard: true,
                  memberId: '08',
                  claimStatusCode: 4,
                },
              ]}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <SpendingAccountSummary
              className="large-section"
              title="Spending Summary"
              linkLabel="View Spending Summary"
              subTitle={'October 12, 2023'}
              amountPaid={1199.19}
              totalBilledAmount={9804.31}
              amountSaved={8605.12}
              amountSavedPercentage={89}
              color1={'#005EB9'}
              color2={'#5DC1FD'}
            />
          </Column>
        </section>
        <Spacer size={32}></Spacer>
      </Column>
    </div>
  );
};

export default MemberDashboardTermedPlan;
