'use client';

import { GetHelpSection } from '@/components/composite/GetHelpSection';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { FilterDetails } from '@/models/filter_dropdown_details';
import SendEmailForm from './components/SendEmailForm';
import { EmailAppData } from './models/emalAppData';

export type SendAnEmailProps = {
  data: EmailAppData;
};

const SendAnEmail = ({ data }: SendAnEmailProps) => {
  const selectedUsers: FilterDetails[] = data.memberDetails.map(
    (item, index) => ({
      label: item.fullName,
      value: item.memberCK,
      id: '' + index,
    }),
  );

  const selectedData: FilterDetails[] = [];
  data.memberDetails.forEach((member, index) => {
    if (member.fullName === 'Me') {
      selectedData.push({
        ...member,
        label: member.fullName,
        value: member.memberCK,
        id: '' + index,
      });
    }
  });

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Column className="md:m-2 m-4">
          <Row className="justify-between mt-2 md:mt-16 lg:mt-0">
            <Column className="max-w-2xl ">
              <Header type="title-1" text="Send an Email" />
              <Spacer size={8} />
              <TextBox
                className="body-1"
                text="If it's after hours or you'd rather send us an email, we're right here."
              />
            </Column>
          </Row>
        </Column>
        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <SendEmailForm
              email={data.email}
              phone=""
              nameDropdown={selectedUsers}
              topicsDropdown={[
                {
                  label: 'Select',
                  value: '43',
                  id: '1',
                },
                {
                  label: 'Benefits & Coverage',
                  value: 'CoverageAndBenefits',
                  id: '2',
                },
                {
                  label: 'New or Existing Claims',
                  value: 'NewOrExistingClaims',
                  id: '3',
                },
                {
                  label: 'Deductibles',
                  value: 'Deductibles',
                  id: '4',
                },
                {
                  label: 'Pharmacy & Prescriptions',
                  value: 'PharmacyAndPrescriptions',
                  id: '5',
                },
                {
                  label: 'Find Care',
                  value: 'FindCare',
                  id: '6',
                },
                {
                  label: 'Dental',
                  value: 'Dental',
                  id: '7',
                },
                {
                  label: 'Membership & Billing Questions',
                  value: 'MembershipAndBillingQuestions',
                  id: '8',
                },
                {
                  label: 'Other',
                  value: '9',
                  id: '9',
                },
              ]}
              onSelectedDateChange={() => {}}
              selectedtopic={{
                label: 'Select',
                value: '43',
                id: '1',
              }}
              selectedName={selectedData[0]}
            />
          </Column>
          <Column className=" flex-grow page-section-63_33 items-stretch ">
            <GetHelpSection
              link="/support/faq"
              linkURL="FAQ."
              headerText="We're Here to Help"
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default SendAnEmail;
