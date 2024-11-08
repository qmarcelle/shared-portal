'use client';

import { GetHelpSection } from '@/components/composite/GetHelpSection';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import SendAnEmailForm from './sendEmailForm';

const SendAnEmail = () => {
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
            <SendAnEmailForm
              topicsDropdown={[
                {
                  label: 'Select',
                  value: '43',
                  id: '1',
                },
                {
                  label: 'Benefits & Coverage',
                  value: '2',
                  id: '2',
                },
                {
                  label: 'New or Existing Claims',
                  value: '3',
                  id: '3',
                },
                {
                  label: 'Deductibles',
                  value: '4',
                  id: '4',
                },
                {
                  label: 'Pharmacy & Prescriptions',
                  value: '5',
                  id: '5',
                },
                {
                  label: 'Find Care',
                  value: '6',
                  id: '6',
                },
                {
                  label: 'Dental',
                  value: '7',
                  id: '7',
                },
                {
                  label: 'Membership & Billing Questions',
                  value: '8',
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
              nameDropdown={[
                {
                  label: 'Chris Hall',
                  value: '43',
                  id: '1',
                },
                {
                  label: 'John',
                  value: '2',
                  id: '2',
                },
              ]}
              selectedName={{
                label: 'Chris Hall',
                value: '43',
                id: '1',
              }}
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
