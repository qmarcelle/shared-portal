'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { AboutPlanContactInfo } from './components/AboutPlanContactInfo';
import { PlanContactCardDetails } from './components/PlanContactCardDetails';

const PlanContactInformation = () => {
  return (
    <Column className="app-content app-base-font-color mt-20">
      <Header
        text="Plan Contact Information"
        className="m-4 mb-0 !font-light !text-[32px]/[40px]"
      />
      <section className="flex justify-start self-start">
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

      <Row>
        <Column className=" flex-grow page-section-36_67 items-stretch">
          <AboutPlanContactInfo />
        </Column>

        <Column className="flex-grow page-section-63_33 items-stretch">
          <PlanContactCardDetails
            planContactDetails={[
              {
                name: 'Chris Hall',
                dob: '01/01/1978',
                age: 15,
                address: '123 Street Address Road City Town, TN 12345',
                phone: '(123) 456-7890',
              },
              {
                name: 'Maddison Hall',
                dob: '01/01/1979',
                age: 15,
                address: '123 Street Address Road City Town, TN 12345',
                phone: '(123) 456-7890',
              },
              {
                name: 'Forest Hall',
                dob: '01/01/2001',
                age: 15,
                address: '123 Street Address Road City Town, TN 12345',
                phone: '(123) 456-7890',
              },
              {
                name: 'Corey Hall',
                dob: '01/01/2002',
                age: 15,
                address: '123 Street Address Road City Town, TN 12345',
                phone: '(123) 456-7890',
              },
              {
                name: 'Telly Hall',
                dob: '01/01/2005',
                age: 15,
                address: '123 Street Address Road City Town, TN 12345',
                phone: '(123) 456-7890',
              },
              {
                name: 'Janie Hall',
                dob: '01/01/2015',
                age: 12,
                address: '123 Street Address Road City Town, TN 12345',
                phone: '(123) 456-7890',
              },
            ]}
          />
        </Column>
      </Row>
    </Column>
  );
};

export default PlanContactInformation;
