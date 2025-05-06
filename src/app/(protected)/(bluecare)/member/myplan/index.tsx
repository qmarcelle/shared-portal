'use client';

import { PlanDetailsSection } from '@/app/(protected)/(common)/member/myplan/components/PlanDetailsSection';
import { ViewOtherPlanInformation } from '@/app/(protected)/(common)/member/myplan/components/ViewOtherPlanInformation';
import { InfoCard } from '@/components/composite/InfoCard';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Column } from '@/components/foundation/Column';
import { securityIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';
import {
  isBlueCareEligible,
  isPayMyPremiumEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { PayPremiumSection } from '@/app/(protected)/(common)/member/dashboard/components/PayPremium';
import { ManageMyPlan } from './components/ManageMyPlan';
import { AllMyPlanData, MyPlanData } from './model/app/myPlanData';

export type MyPlanProps = {
  data: MyPlanData;
  planData: AllMyPlanData[];
};
const MyPlan = ({ data, planData }: MyPlanProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <WelcomeBanner
        className="px-4"
        titleText=""
        name="My Plan"
        body={
          <RichText
            spans={[
              <span key={0}>If you have questions, </span>,
              <span className="link !text-white" key={1}>
                <a>start a chat</a>
              </span>,
              <span key={2}> or call us at [1-800-000-000].</span>,
            ]}
          />
        }
      />
      <Spacer size={32}></Spacer>
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <PlanDetailsSection
              className="large-section"
              svgData={data.idCardSvgFrontData}
              planType={data.planType}
              visibilityRules={data.visibilityRules}
              planData={planData}
            />
          </Column>
          <Column className="flex-grow page-section-36_67 items-stretch">
            {isPayMyPremiumEligible(data.visibilityRules) && (
              <PayPremiumSection
                className="large-section"
                dueDate="08/10/2023"
                amountDue={1000.46}
              />
            )}
            <ManageMyPlan
              className="small-section"
              visibilityRules={data.visibilityRules}
            />
            {isBlueCareEligible(data.visibilityRules) && (
              <InfoCard
                key="Profile Settings"
                label="Profile Settings"
                icon={securityIcon}
                body="Update your security and communication settings or share permissions."
                link="/profileSettings"
              />
            )}
          </Column>
        </section>
        <Column>
          <Spacer size={32} />
          <Title className="title-1" text="View Other Plan Information" />
          <Spacer size={32} />
          <section className="flex flex-row items-start app-body">
            <Column className=" flex-grow page-section-36_67 items-stretch">
              <ViewOtherPlanInformation
                visibilityRules={data.visibilityRules}
              />
            </Column>
          </section>
        </Column>
      </Column>
    </main>
  );
};

export default MyPlan;
