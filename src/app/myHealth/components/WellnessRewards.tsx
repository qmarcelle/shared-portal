import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { ProgressBar } from '@/components/foundation/ProgressBar';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { isChipRewardsINTEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import { ReactNode } from 'react';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Header } from '../../../components/foundation/Header';
import { externalIcon } from '../../../components/foundation/Icons';
import { MemberRewards } from '../models/app/my_health_data';

interface WellnessRewardsProps extends IComponent {
  color1?: string;
  color2?: string;
  memberRewards: MemberRewards | null;
  icon?: ReactNode;
  linkText?: string;
  visibilityRules?: VisibilityRules;
  isMemRelation?: string;
}

export const WellnessRewards = ({
  className,
  // color2 = '#5DC1FD',
  //color1 = '#f2f2f2',
  linkText = 'View Ways to Earn & Learn more',
  icon = <Image alt="external icon" src={externalIcon} />,
  memberRewards,
  visibilityRules,
  isMemRelation,
}: WellnessRewardsProps) => {
  return (
    <>
      <Card className={className}>
        <>
          <Header type="title-2" text="Wellness Rewards" />
          <Spacer size={25} />
          {memberRewards ? (
            <>
              <Row className="justify-between hidden sm:flex">
                <Column className="w-full">
                  {/* To Do: Need to Revisit the logic once we get proper api response in phase 2.
            {memberRewards.quarter && (
              <TextBox
                text={`${memberRewards.quarter} | ${Quarter[memberRewards.quarter]}`}
              />
            )} */}
                  <Spacer size={5} />
                  {memberRewards.isSelfFunded ? (
                    <RichText
                      type="body-1"
                      spans={[
                        <span className="font-bold" key={0}>
                          You&apos;ve earned{' '}
                        </span>,
                        <span className="font-bold" key={1}>
                          ${`${memberRewards.totalAmountEarned} `}
                        </span>,
                        <span key={3}>
                          {` / $${memberRewards.totalAmount}`}
                        </span>,
                      ]}
                    />
                  ) : (
                    <RichText
                      type="body-1"
                      spans={[
                        <span className="font-bold" key={0}>
                          You&apos;ve earned{' '}
                        </span>,
                        <span className="font-bold" key={1}>
                          {`${memberRewards.quarterlyPointsEarned} `}
                        </span>,
                        <span key={3}>
                          {` / ${memberRewards.quarterlyMaxPoints} Points`}
                        </span>,
                      ]}
                    />
                  )}

                  <Spacer size={16} />
                  {memberRewards.isSelfFunded ? (
                    <ProgressBar
                      height={10}
                      completePercent={
                        (memberRewards.totalAmountEarned /
                          memberRewards.totalAmount) *
                        100
                      }
                    />
                  ) : (
                    <ProgressBar
                      height={10}
                      completePercent={
                        (memberRewards.quarterlyPointsEarned /
                          memberRewards.quarterlyMaxPoints) *
                        100
                      }
                    />
                  )}
                  <Spacer size={12} />
                  <Row className="justify-between">
                    {!memberRewards.isSelfFunded ? (
                      <Column>
                        <TextBox className="body-2" text="100 points = $100" />
                      </Column>
                    ) : (
                      <Spacer size={32} />
                    )}

                    <Column className="items-end">
                      {!memberRewards.isSelfFunded ? (
                        <>
                          <TextBox
                            className="font-bold text-end"
                            text={`${memberRewards.quarterlyMaxPoints} pts`}
                          />
                          <TextBox className="body-2" text="Quarterly Max" />
                        </>
                      ) : (
                        <>
                          <TextBox
                            className="font-bold text-end"
                            text={`$${memberRewards.totalAmount}`}
                          />
                          <TextBox className="body-2" text="Annual Max" />
                        </>
                      )}
                    </Column>
                  </Row>
                  <Spacer size={18} />
                  <Row>
                    {isMemRelation &&
                    isChipRewardsINTEligible(visibilityRules) ? (
                      <AppLink
                        className="body-1"
                        label={linkText}
                        url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS}`}
                      />
                    ) : (
                      <AppLink
                        className="body-1"
                        label={linkText}
                        url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS}`}
                      />
                    )}
                    <Image alt="external icon" src={externalIcon} />
                  </Row>
                  <Spacer size={18} />
                  <Divider />
                  <Spacer size={32} />

                  <TextBox
                    className="body-2"
                    text="Wellness Rewards is based on your processed claims.There may be a delay in the Wellness Rewards information updating."
                  />
                </Column>
              </Row>
              <Column className="block sm:hidden">
                <Spacer size={5} />
                <TextBox text="My Points" />
                <Spacer size={16} />
                {memberRewards.isSelfFunded ? (
                  <ProgressBar
                    height={10}
                    completePercent={
                      (memberRewards.totalAmountEarned /
                        memberRewards.totalAmount) *
                      100
                    }
                  />
                ) : (
                  <ProgressBar
                    height={10}
                    completePercent={
                      (memberRewards.quarterlyPointsEarned /
                        memberRewards.quarterlyMaxPoints) *
                      100
                    }
                  />
                )}

                <Spacer size={18} />
                <Row className="items-center">
                  <TextBox text="100 points = $100" />
                  &nbsp;|
                  <AppLink label="View Rewards FAQ" />
                </Row>
                <Spacer size={18} />
                <Button label={linkText} icon={icon} callback={() => null} />
              </Column>
            </>
          ) : (
            <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
          )}
        </>
      </Card>
      {/* <WellnessInfo
        header="Active Rewards - Employer Provided Reward"
        subHeader="Wellness Rewards"
        bodyText="Complete wellness tasks to earn rewards provided by your employer."
        buttonText="Learn More"
        className="section"
      /> */}
    </>
  );
};
