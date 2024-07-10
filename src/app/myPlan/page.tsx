'use client';

import { PlanDetailsSection } from '@/app/myPlan/components/PlanDetailsSection';
import { ViewOtherPlanInformation } from '@/app/myPlan/components/ViewOtherPlanInformation';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';
import { ManageMyPlan } from './components/ManageMyPlan';

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
          <Column className="flex-grow page-section-36_67 items-stretch">
            <ManageMyPlan
              className="small-section"
              managePlanItems={[
                {
                  title: 'Report Other Health Insurance',
                  body: 'Do you or anyone else on your plan have other insurance? Let us know so we can process your claims correctly.',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Update Social Security Number',
                  body: 'Add or update the Social Security Number associated with your plan.',
                  externalLink: false,
                  url: '/profileSettings',
                },
                {
                  title: 'Enroll in a Health Plan',
                  body: 'All our plans include a wide choice of doctors and healthy, money-saving extras. We’ll walk you through your options and help you choose the right one for your family.',
                  externalLink: true,
                  url: 'url',
                },
              ]}
            />
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
