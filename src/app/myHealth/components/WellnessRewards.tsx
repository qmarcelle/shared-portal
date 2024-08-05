import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { ProgressBar } from '@/components/foundation/ProgressBar';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Header } from '../../../components/foundation/Header';
import { externalOffsiteWhiteIcon } from '../../../components/foundation/Icons';
import { WellnessRewardsChart } from './WellnessRewardsChart';

interface WellnessRewardsProps extends IComponent {
  color1: string;
  color2: string;
  totalAmountEarned: number;
  totalAmount: number;
  quarterlyMaxPoints: number;
  quarterlyPointsEarned: number;
  icon?: ReactNode;
  linkText: string;
  quarter: string;
}

export const WellnessRewards = ({
  className,
  color1,
  color2,
  quarterlyPointsEarned,
  quarterlyMaxPoints,
  totalAmountEarned,
  totalAmount,
  linkText,
  icon = <Image alt="external icon" src={externalOffsiteWhiteIcon} />,
  quarter,
}: WellnessRewardsProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  function getQuarterRange() {
    if (quarter == 'Q1') {
      return 'JAN - APR';
    } else if (quarter == 'Q2') {
      return 'MAY - AUG';
    } else if (quarter == 'Q3') {
      return 'SEP - DEC';
    }
  }

  function getDesktopView() {
    return (
      <Card className={className}>
        <>
          <Header type="title-2" text="Wellness Rewards" />
          <Spacer size={25} />
          <Row className="justify-between">
            <Column className="w-1/2">
              <TextBox text={`${quarter} | ${getQuarterRange()}`} />
              <Spacer size={5} />
              <TextBox text="My Points" />
              <Spacer size={16} />
              <ProgressBar
                height={10}
                completePercent={
                  (quarterlyPointsEarned / quarterlyMaxPoints) * 100
                }
              />
              <Spacer size={12} />
              <Row className="justify-between">
                <Column>
                  <TextBox
                    className="font-bold"
                    text={`${quarterlyPointsEarned} pts`}
                  />
                  <TextBox text="Earned" />
                </Column>
                <Column>
                  <TextBox
                    className="font-bold text-end"
                    text={`${quarterlyMaxPoints} pts`}
                  />
                  <TextBox text="Quarterly Max" />
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
                earnedAmount={totalAmountEarned}
                maxAmount={totalAmount}
              />
            </Column>
          </Row>
        </>
      </Card>
    );
  }

  function getMobileView() {
    return (
      <Card className={className}>
        <>
          <Header type="title-2" text="Wellness Rewards" />
          <Spacer size={25} />
          <Column>
            <TextBox text={`${quarter} | ${getQuarterRange()}`} />
            <Spacer size={5} />
            <TextBox text="My Points" />
            <Spacer size={16} />
            <ProgressBar
              height={10}
              completePercent={
                (quarterlyPointsEarned / quarterlyMaxPoints) * 100
              }
            />
            <Spacer size={12} />
            <Row className="justify-between">
              <Column>
                <TextBox
                  className="font-bold"
                  text={`${quarterlyPointsEarned} pts`}
                />
                <TextBox text="Earned" />
              </Column>
              <Column>
                <TextBox
                  className="font-bold text-end"
                  text={`${quarterlyMaxPoints} pts`}
                />
                <TextBox text="Quarterly Max" />
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
          <Spacer size={32} />
          <Divider />
          <Spacer size={25} />
          <Column>
            <WellnessRewardsChart
              color1={color1}
              color2={color2}
              earnedAmount={totalAmountEarned}
              maxAmount={totalAmount}
            />
          </Column>
        </>
      </Card>
    );
  }

  return isMobile ? getMobileView() : getDesktopView();
};
