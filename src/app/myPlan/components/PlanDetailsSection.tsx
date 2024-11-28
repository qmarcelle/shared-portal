import { OnMyPlanComponent } from '@/components/composite/OnMyPlanComponent';
import { Accordion } from '@/components/foundation/Accordion';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import Down from '../../../../public/assets/down.svg';
import Up from '../../../../public/assets/up.svg';
import { PlanContactInformationSection } from './PlanContactInformationSection';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';

export type PlanDeatilsSectionProps = {
  svgData: string | null;
  visibilityRules?: VisibilityRules;
} & IComponent;

export const PlanDetailsSection = ({
  className,
  svgData,
  visibilityRules,
}: PlanDeatilsSectionProps) => {
  function IDCardFront() {
    return (
      <Column>
        {svgData == null && (
          <Column className="m-2 mb-10">
            <TextBox
              className="id-card-error-msg"
              text="Your ID card is not available at this time."
            ></TextBox>
          </Column>
        )}
        {svgData && (
          <Image
            src={`data:image/svg+xml;charset=utf8,${encodeURIComponent(svgData)}`}
            alt="switch"
            fill={true}
            className="!relative"
          />
        )}
      </Column>
    );
  }

  return (
    <Card className={className}>
      <div className="flex flex-col">
        <h2 className="title-2">Plan Details</h2>
        <Spacer size={32} />
        <Row>
          <TextBox className="planType" text="Plan Type:"></TextBox>
          {!isBlueCareEligible(visibilityRules) ? (
            <TextBox
              text="High Deductible Health Plan with Health Savings Account (HDHP-HSA)"
              className="font-bold"
            ></TextBox>
          ) : (
            <TextBox text="BlueCare Medicaid" className="font-bold"></TextBox>
          )}
        </Row>
        <Spacer size={32} />
        {IDCardFront()}

        {!isBlueCareEligible(visibilityRules) && (
          <Column>
            <Spacer size={16} />
            <TextBox text="All members of your plan use the same ID card."></TextBox>
          </Column>
        )}
        <Spacer size={32} />
        <AppLink
          className="p-0"
          label="View More ID Card Options"
          url="/memberIDCard"
        />
        <Spacer size={24} />
        <Divider />
        <Spacer size={32} />
        <Card>
          <Column className="items-stretch">
            <Accordion
              className="px-2 py-4"
              label="View Who's Covered"
              initialOpen={false}
              type="card"
              openIcon={
                <Image
                  className="pl-2 w-6"
                  src={Down}
                  alt="Down Chevron"
                ></Image>
              }
              closeIcon={
                <Image className="pl-2 w-6" src={Up} alt="Up Chevron"></Image>
              }
              child={
                <OnMyPlanComponent
                  infoIcon={true}
                  onMyPlanDetails={[
                    {
                      memberName: 'Chris Hall',
                      DOB: '01/01/1978',
                      sharingType: 'Medical / Dental / Vision',
                      isMinor: false,
                    },
                    {
                      memberName: 'Maddison Hall',
                      DOB: '01/01/2021',
                      sharingType: 'Medical / Dental / Vision',
                      isMinor: false,
                    },
                    {
                      memberName: 'Forest Hall',
                      DOB: '01/01/2001',
                      sharingType: 'Medical',
                      isMinor: false,
                    },
                    {
                      memberName: 'Corey Hall',
                      DOB: '01/01/2002',
                      sharingType: 'Medical',
                      isMinor: false,
                    },
                    {
                      memberName: 'Telly Hall',
                      DOB: '01/01/2008',
                      sharingType: 'Medical',
                      isMinor: false,
                    },
                  ]}
                />
              }
            ></Accordion>
          </Column>
        </Card>
        <Spacer size={16} />
        <Card>
          <Column className="items-stretch">
            <Accordion
              className="px-2 py-4"
              label="View Plan Contact Information"
              initialOpen={false}
              type="card"
              openIcon={
                <Image
                  className="pl-2 w-6"
                  src={Down}
                  alt="Down Chevron"
                ></Image>
              }
              closeIcon={
                <Image className="pl-2 w-6" src={Up} alt="Up Chevron"></Image>
              }
              child={
                <PlanContactInformationSection
                  title="Below is the phone number and mailing address associated with your plan."
                  address="123 Street Address Road City Town, TN 12345"
                  primaryPhoneNumber="(123) 456-7890"
                  secondaryPhoneNumber="NA"
                />
              }
            ></Accordion>
          </Column>
        </Card>
      </div>
    </Card>
  );
};
