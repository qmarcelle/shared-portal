'use client';

import { NotificationSection } from '@/app/inbox/components/NotificationSection';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';

const ProfileSettings = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Inbox"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="large-section px-0 m-0"
              filterHeading="Filter Notifications"
              filterItems={[
                {
                  type: 'dropdown',
                  label: 'Read Status',
                  value: [
                    {
                      label: 'Read & Unread',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Read Status',
                      value: '2',
                      id: '2',
                    },
                  ],
                  selectedValue: {
                    label: 'Read & Unread',
                    value: '1',
                    id: '1',
                  },
                },
              ]}
            />
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch mt-4">
            <NotificationSection
              notificationCards={[
                {
                  title: 'Important Pharmacy Changes',
                  body: 'Read about changes to your pharmacy and prescription coverage.',
                  time: '4 mins ago',
                  readIndicator: false,
                },
                {
                  title: 'Set Up Automatic Payments',
                  body: 'Your benefits and ID cards will be active once your first payment is processed. Want to make your payment now? Download the Bank Draft Form Authorization and set up bank drafts to pay health insurance premiums automatically each month, or call our Membership and Billing team at (800) 000-0000, Monday–Friday 8 a.m. – 5:15 p.m.  ET.',
                  time: '4 mins ago',
                  readIndicator: false,
                },
                {
                  title: 'COVID-19',
                  body: 'We answer your COVID-19 vaccine questions.',
                  time: '1 day ago',
                  readIndicator: false,
                },
                {
                  title: 'Communication Preferences',
                  body: 'Get information about your plan faster and go digital today.',
                  time: '2 days ago',
                  readIndicator: false,
                },
                {
                  title: 'FSA Balance Reminder',
                  body: 'FSA funds many not carry over, so check your balance by the end of the year.',
                  time: '8 months ago',
                  readIndicator: true,
                },
              ]}
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default ProfileSettings;
