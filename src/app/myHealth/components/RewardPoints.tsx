import { PharmacyFAQ } from '@/app/pharmacy/components/PharmacyFAQ';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import Image from 'next/image';

export const RewardPoints = () => {
  return (
    <Column>
      <Card className="large-section flex flex-row items-start app-body ">
        <Column>
          <PharmacyFAQ
            serviceTitle="How to Earn Reward Points"
            className="large-section"
            services={[
              {
                serviceLabel: 'How do I complete the PHA?',
                answerline1: (
                  <RichText
                    className="manage-image"
                    spans={[
                      <span key={0}>Your can </span>,
                      <span className="link" key={1}>
                        <a>take your PHA here</a>
                        <Image src={externalIcon} alt="external Icon" />
                      </span>,
                      <span className="!no-underline" key={2}>
                        .
                      </span>,
                    ]}
                  />
                ),
                answerline2: '',
              },
              {
                serviceLabel:
                  'When can I start completing the reward activities?',
                answerline1:
                  'You can begin earning points Jan. 1 each year (starting with your PHA). ',
                answerline2: '',
              },
              {
                serviceLabel: 'How do I submit my daily steps?',
                answerline1: (
                  <RichText
                    className="manage-image"
                    spans={[
                      <span key={0}>You can track steps using any </span>,
                      <span className="link" key={1}>
                        <a>approved app or device </a>
                        <Image src={externalIcon} alt="external Icon" />
                      </span>,
                      <span className="!no-underline" key={2}>
                        .{' '}
                      </span>,
                      <span key={3}>
                        To get started, link your app or device in the{' '}
                      </span>,
                      <span className="link" key={4}>
                        <a>Member Wellness Center</a>
                        <Image src={externalIcon} alt="external Icon" />
                      </span>,
                      <span className="!no-underline" key={5}>
                        .
                      </span>,
                    ]}
                  />
                ),
                answerline2: '',
              },
              {
                serviceLabel:
                  'I have health issues that make completing some of the eligible wellness activities difficult. Are there any other ways I can earn points?',
                answerline1:
                  'Yes. If you or a covered spouse are unable to complete some of the wellness activities listed above, you might qualify for an opportunity to earn the same reward through different activities. Call us at 1-844-269-2583 and we’ll work with you (and, if you wish, your doctor) to find a new wellness program that offers the same reward but works better for you.',
                answerline2: '',
              },
            ]}
          />
        </Column>
      </Card>
      <Card className="large-section flex flex-row items-start app-body ">
        <Column>
          <PharmacyFAQ
            serviceTitle="About Points"
            className="large-section"
            services={[
              {
                serviceLabel: 'How do I redeem my points?',
                answerline1:
                  // eslint-disable-next-line quotes
                  "Each quarter, we'll email you a $100 Visa digital gift card the month following your achievement of earning 100 points. Be sure your bcbst.com profile has your current email address, so you don't miss it.",
                answerline2: '',
              },
              {
                serviceLabel: 'How much can my family earn?',
                answerline1:
                  'You and your spouse (if covered) can earn up to $100 each quarter, and a maximum of $400 for each of you per calendar year.',
                answerline2: '',
              },
              {
                serviceLabel:
                  'How can I check the status of my Visa Gift Card?',
                answerline1:
                  'Call us at 1-844-269-2583 or email help@bcbstrewards.com.',
                answerline2: '',
              },
              {
                serviceLabel: 'Where can I view the points I’ve earned?',
                answerline1: (
                  <RichText
                    className="manage-image"
                    spans={[
                      <span key={0}>View your points on your </span>,
                      <span className="link" key={1}>
                        <a href="/member/myhealth">Health Dashboard</a>
                      </span>,
                      <span className="!no-underline" key={2}>
                        .
                      </span>,
                    ]}
                  />
                ),
                answerline2: '',
              },
            ]}
          />
        </Column>
      </Card>

      <Card className="large-section flex flex-row items-start app-body ">
        <Column>
          <PharmacyFAQ
            serviceTitle="About The Rewards Programs"
            className="large-section"
            services={[
              {
                serviceLabel: 'When does each quarter end?',
                answerline1: 'The quarters end:',

                answerline2: 'March 31',
              },
              {
                serviceLabel:
                  'What happens to my points if I don’t earn 100 points by the end of the quarter?',
                answerline1:
                  'If you don’t reach the 100 pts by the end of the first, second or third quarter, your points will roll over to the following quarter. Points don’t roll over from year to year.',
                answerline2: '',
              },
              {
                serviceLabel:
                  'You’re missing my activity, or my points don’t match what I think they should be. How do I get it corrected?',
                answerline1: 'Please call us at 1-800-565-9140.',
                answerline2: '',
              },
              {
                serviceLabel:
                  'If I accidentally delete the email with the digital gift card, can I get a new email/gift card sent to me?',
                answerline1:
                  'Yes. Please call us at 1-844-269-2583 or email help@bcbstrewards.com.',
                answerline2: '',
              },
            ]}
          />
        </Column>
      </Card>
    </Column>
  );
};
