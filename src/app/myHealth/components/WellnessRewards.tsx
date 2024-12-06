import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { ProgressBar } from '@/components/foundation/ProgressBar';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { ReactNode } from 'react';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Header } from '../../../components/foundation/Header';
import { externalOffsiteWhiteIcon } from '../../../components/foundation/Icons';
import { MemberRewards } from '../models/app/my_health_data';
import { WellnessRewardsChart } from './WellnessRewardsChart';

interface WellnessRewardsProps extends IComponent {
  color1?: string;
  color2?: string;
  memberRewards: MemberRewards | null;
  icon?: ReactNode;
  linkText?: string;
}

export const WellnessRewards = ({
  className,
  color2 = '#5DC1FD',
  color1 = '#f2f2f2',
  linkText = 'View Ways to Earn',
  icon = <Image alt="external icon" src={externalOffsiteWhiteIcon} />,
  memberRewards,
}: WellnessRewardsProps) => {
  return (
    <Card className={className}>
      <>
        <Header type="title-2" text="Wellness Rewards" />
        <Spacer size={25} />
        {memberRewards ? (
          <>
            <Row className="justify-between hidden sm:flex">
              <Column className="w-1/2">
                {/* To Do: Need to Revisit the logic once we get proper api response in phase 2.
                {memberRewards.quarter && (
                  <TextBox
                    text={`${memberRewards.quarter} | ${Quarter[memberRewards.quarter]}`}
                  />
                )} */}
                <Spacer size={5} />
                <TextBox text="My Points" />
                <Spacer size={16} />
                <ProgressBar
                  height={10}
                  completePercent={
                    (memberRewards.quarterlyPointsEarned /
                      memberRewards.quarterlyMaxPoints) *
                    100
                  }
                />
                <Spacer size={12} />
                <Row className="justify-between">
                  <Column>
                    <TextBox
                      className="font-bold"
                      text={`${memberRewards.quarterlyPointsEarned} pts`}
                    />
                    <TextBox text="Earned" />
                  </Column>
                  <Column className="items-end">
                    <TextBox
                      className="font-bold text-end"
                      text={`${memberRewards.quarterlyMaxPoints} pts`}
                    />
                    <TextBox text="Max" />
                  </Column>
                </Row>
                <Spacer size={18} />
                <Row className="items-center">
                  <TextBox text="100 points = $100" />
                  &nbsp;|
                  <AppLink label="View Rewards FAQ" />
                </Row>
                <Spacer size={18} />
                <Button label={linkText} icon={icon} callback={() => null} />
              </Column>
              <Divider axis="horizontal" />
              <Column>
                <WellnessRewardsChart
                  color1={color1}
                  color2={color2}
                  earnedAmount={memberRewards.totalAmountEarned}
                  maxAmount={memberRewards.totalAmount}
                />
              </Column>
            </Row>
            <Column className="block sm:hidden">
              {/* To Do: Need to Revisit the logic once we get proper api response in phase 2.
              {memberRewards.quarter && (
                <TextBox
                  text={`${memberRewards.quarter} | ${Quarter[memberRewards.quarter]}`}
                />
              )} */}
              <Spacer size={5} />
              <TextBox text="My Points" />
              <Spacer size={16} />
              <ProgressBar
                height={10}
                completePercent={
                  (memberRewards.quarterlyPointsEarned /
                    memberRewards.quarterlyMaxPoints) *
                  100
                }
              />
              <Spacer size={12} />
              <Row className="justify-between">
                <Column>
                  <TextBox
                    className="font-bold"
                    text={`${memberRewards.quarterlyPointsEarned} pts`}
                  />
                  <TextBox text="Earned" />
                </Column>
                <Column>
                  <TextBox
                    className="font-bold text-end"
                    text={`${memberRewards.quarterlyMaxPoints} pts`}
                  />
                  <TextBox text="Max" />
                </Column>
              </Row>
              <Spacer size={18} />
              <Row className="items-center">
                <TextBox text="100 points = $100" />
                &nbsp;|
                <AppLink label="View Rewards FAQ" />
              </Row>
              <Spacer size={18} />
              <Button label={linkText} icon={icon} callback={() => null} />

              <Spacer size={32} />
              <Divider />
              <Spacer size={25} />

              <WellnessRewardsChart
                color1={color1}
                color2={color2}
                earnedAmount={memberRewards.totalAmountEarned}
                maxAmount={memberRewards.totalAmount}
              />
            </Column>
          </>
        ) : (
          <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
        )}
      </>
    </Card>
  );
};
