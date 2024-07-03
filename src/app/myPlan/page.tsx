'use client';

import { PlanDetailsSection } from '@/app/myPlan/components/PlanDetailsSection';
import { ViewOtherPlanInformation } from '@/app/myPlan/components/ViewOtherPlanInformation';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';

const MyPlan = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <WelcomeBanner
        className="px-4"
        titleText=""
        name="My Plan"
        body={
          <>
            {' '}
            <p className="body-1">
              If you have questions, call [1-800-000-000].
            </p>
          </>
        }
      />
      <Spacer size={32}></Spacer>
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <PlanDetailsSection className="large-section" />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <div></div>
          </Column>
        </section>
        <Column>
          <Spacer size={32} />
          <Title className="title-2 ml-5" text="View Other Plan Information" />
          <Spacer size={32} />
          <section className="flex flex-row items-start app-body">
            <Column className=" flex-grow page-section-36_67 items-stretch">
              <ViewOtherPlanInformation />
            </Column>
          </section>
        </Column>
      </Column>
    </main>
  );
};

export default MyPlan;
