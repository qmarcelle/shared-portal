import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { ProgressBar } from '@/components/foundation/ProgressBar';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { MemberRewards } from '@/app/(protected)/(common)/member/myhealth/models/app/my_health_data';

export default function RewardsPage() {
  // TODO: Fetch member rewards from API
  const memberRewards: MemberRewards | null = null;
  const linkText = 'View Ways to Earn & Learn more';
  const icon = <Image alt="external icon" src={externalIcon} />;

  return (
    <>
      {memberRewards?.isSelfFunded ? (
        <Header text="Active Rewards - Self Funded" />
      ) : (
        <Header text="Active Rewards - Fully Insured & Level Funded" />
      )}
      <Card>
        <>
          <Header type="title-2" text="Wellness Rewards" />
          <Spacer size={25} />
          {memberRewards ? (
            <>
              <Row className="justify-between hidden sm:flex">
                <Column className="w-full">
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
                    <AppLink className="body-1" label={linkText} />
                    <Image alt="external icon" src={externalIcon} />
                  </Row>
                  <Spacer size={18} />
                  <Divider />
                  <Spacer size={32} />

                  <TextBox
                    className="body-2"
                    text="Wellness Rewards is based on your processed claims. There may be a delay in the Wellness Rewards information updating."
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
    </>
  );
}