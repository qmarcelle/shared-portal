'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { HowToEarn } from '../components/HowToEarn';
import { RewardPoints } from '../components/RewardPoints';

const RewardProgramsFaqs = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="mb-0" text="Rewards Program FAQs" />
        <Spacer size={16} />
        <TextBox
          className="body-1 mb-2"
          text="If you need help, call [1-800-000-000] or email help@bcbstrewards.com."
        ></TextBox>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow basis-6/12 items-stretch mt-4">
            <HowToEarn
              title={'How to Earn Reward Points'}
              linkText={'View All Ways to Earn Points'}
              rewards={[
                {
                  id: '1',
                  rewardTitle: 'Personal Health Assessment (PHA)',
                  rewardDescription:
                    'Take your assessment first to start earning rewards points',
                  rewardPoints: '50 Points',
                },
                {
                  id: '2',
                  rewardTitle: 'Annual Preventive Exam',
                  rewardDescription: '1 visit per year max',
                  rewardPoints: '100 Points',
                },
                {
                  id: '3',
                  rewardTitle: 'Register for Teladoc™ Health',
                  rewardDescription:
                    'New registration only | 1 registration per person',
                  rewardPoints: '50 Points',
                },
                {
                  id: '4',
                  rewardTitle: 'Teladoc Health Use',
                  rewardDescription: 'Per each use | 100 points max per year',
                  rewardPoints: '50 Points',
                },
                {
                  id: '5',
                  rewardTitle: 'Daily Steps',
                  rewardDescription:
                    'Per 5,000 steps | 100 points max per year',
                  rewardPoints: '1 Point',
                },
                {
                  id: '6',
                  rewardTitle: 'Flu Shot',
                  rewardDescription: '1 per year max',
                  rewardPoints: '50 Points',
                },
                {
                  id: '7',
                  rewardTitle:
                    'Chronic Condition/Case Management Engagement (2 Consults)',
                  rewardDescription:
                    'After completing second consult | 1 per quarter | 100 points max per year',
                  rewardPoints: '50 Points',
                },
                {
                  id: '8',
                  rewardTitle:
                    'Cancer Screenings (Mammogram, Colorectal, Cervical or Prostate)',
                  rewardDescription: 'Only 1 screening per year',
                  rewardPoints: '100 Points',
                },
                {
                  id: '9',
                  rewardTitle:
                    'Diabetes Management (A1C, Urine Test and Kidney Function)',
                  rewardDescription:
                    '1 test per year | 150 points max per year',
                  rewardPoints: '50 Points',
                },
                {
                  id: '10',
                  rewardTitle: 'Healthy Maternity Completion',
                  rewardDescription: '1 per year max',
                  rewardPoints: '100 Points',
                },
              ]}
              linkIcon={<Image src={externalIcon} alt="download form" />}
            />
          </Column>

          <Column className="flex-grow basis-6/12 items-stretch">
            <RewardPoints />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default RewardProgramsFaqs;
