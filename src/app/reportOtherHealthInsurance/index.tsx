'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { AddMemberDetails } from '@/models/add_member_details';
import { AboutOtherInsurance } from './components/AboutOtherInsurance';
import { OtherHealthInsuranceCard } from './components/OtherHealthInsuranceCard';
export type ReportOtherHealthInsuranceProps = {
  data: AddMemberDetails;
};

const ReportOtherHealthInsurance = ({
  data,
}: ReportOtherHealthInsuranceProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color mt-20">
        <Header
          text="Report Other Health Insurance"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row
                className="body-1 flex-grow md:!flex !block align-top mt-4 ml-4"
                key={1}
              >
                Each year, we&apos;ll ask you to report to us whether anyone on
                your plan has other medical or dental insurance (like Medicare,
                employer plans or extra coverage)
              </Row>,
            ]}
          />
        </section>

        <section className="flex flex-row items-start app-body mt-8">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <AboutOtherInsurance />
          </Column>

          <Column className="flex-grow page-section-63_33 items-stretch">
            <OtherHealthInsuranceCard
              otherHealthInsuranceDetails={[
                {
                  memberName: 'Chris Hall',
                  DOB: '01/01/1978',
                  updatedDate: '01/16/2023',
                },
                {
                  memberName: 'Maddison Hall',
                  DOB: '01/01/1979',
                  updatedDate: '01/16/2023',
                },
                {
                  memberName: 'Forest Hall',
                  DOB: '01/01/2001',
                  updatedDate: '01/16/2023',
                },
                {
                  memberName: 'Corey Hall',
                  DOB: '01/01/2002',
                  updatedDate: '01/16/2023',
                },
                {
                  memberName: 'Telly Hall',
                  DOB: '01/01/2005',
                  updatedDate: '01/16/2023',
                },
                {
                  memberName: 'Janie Hall',
                  DOB: '01/01/2015',
                  updatedDate: '01/16/2023',
                },
              ]}
              memberDetails={data}
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default ReportOtherHealthInsurance;
