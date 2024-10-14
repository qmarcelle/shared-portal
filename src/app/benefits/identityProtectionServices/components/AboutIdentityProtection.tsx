import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { TextBox } from '@/components/foundation/TextBox';

export const AboutIdentityProtection = () => {
  return (
    <AccordionListCard
      header="About Identity Protection"
      information={[
        {
          title: 'About Enrollment',
          body: (
            <TextBox text="Your identity protection covers you for a 12-month period. You’ll receive an email from Experian 30 days before the 12-month period is over, reminding you that your identity protection is expiring. If you wish to continue this service, you can re-enroll at that time as long as you have eligible BlueCross medical coverage." />
          ),
        },
        {
          title: 'How to Re-enroll',
          body: (
            <TextBox text="To re-enroll, select the plan and follow the steps. Remember to re-enroll all covered members." />
          ),
        },
      ]}
    ></AccordionListCard>
  );
};
