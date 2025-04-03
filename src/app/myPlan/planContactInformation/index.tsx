'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { SpacerX } from '@/components/foundation/Spacer';
import { AllMyPlanData } from '../model/app/myPlanData';
import { AboutPlanContactInfo } from './components/AboutPlanContactInfo';
import { PlanContactCardDetails } from './components/PlanContactCardDetails';

export type PlanContactInformationProps = {
  planData: AllMyPlanData<string>[];
};
const PlanContactInformation = ({ planData }: PlanContactInformationProps) => {
  return (
    <Column className="app-content app-base-font-color mt-20">
      <Header
        text="Plan Contact Information"
        className="m-4 mb-0 !font-light !text-[32px]/[40px]"
      />
      <section className="flex justify-start self-start mb-6">
        <RichText
          spans={[
            <Row
              className="body-1 flex-grow md:!flex !block align-top mt-4 ml-4"
              key={1}
            >
              Below is the mailing address and phone number associated with your
              plan. 
            </Row>,
          ]}
        />
      </section>

      <Column className="md:!flex-row">
        <Column className="flex-grow page-section-36_67 items-stretch md:ml-4">
          <AboutPlanContactInfo />
        </Column>
        <SpacerX size={32} />

        <Column className="flex-grow page-section-63_33 items-stretch">
          <PlanContactCardDetails planContactDetails={planData} />
        </Column>
      </Column>
    </Column>
  );
};

export default PlanContactInformation;
