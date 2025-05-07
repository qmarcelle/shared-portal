import { ErrorCard } from '@/components/composite/ErrorCard';
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
import { NOT_AVAILABLE } from '@/utils/constants';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import Down from '../../../../public/assets/down.svg';
import Up from '../../../../public/assets/up.svg';
import { AllMyPlanData } from '../model/app/myPlanData';
import { PlanContactInformationSection } from './PlanContactInformationSection';

export type PlanDeatilsSectionProps = {
  svgData: string | null;
  planType: string | null;
  visibilityRules?: VisibilityRules;
  planData: AllMyPlanData<string>[];
} & IComponent;

export const PlanDetailsSection = ({
  className,
  svgData,
  planType,
  visibilityRules,
  planData,
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

  const onMyPlanDetails = planData.map((member) => {
    return {
      memberName: member.memberName,
      DOB: new Date(member.dob).toLocaleDateString(),
      sharingType: member.planDetails
        .map((plan) => {
          if (plan.isMedical) return 'Medical';
          if (plan.isDental) return 'Dental';
          if (plan.isVision) return 'Vision';
          return '';
        })
        .filter((type) => type !== '')
        .join(' / '),
      medicalEffectiveDate: member.medicalEffectiveDate,
      dentalEffectiveDate: member.dentalEffectiveDate,
      visionEffectiveDate: member.visionEffectiveDate,
      isMinor: false,

      address1: member.address1,
      cityStateZip: member.address2,

      primaryPhoneNumber: member.primaryPhoneNumber,
      secondaryPhoneNumber: member.secondaryPhoneNumber,
      memck: member.memCk,
      loggedInMember: member.loggedInMember,
    };
  });

  const loggedInMember = onMyPlanDetails.find(
    (item) => item.loggedInMember == true,
  );

  return (
    <Card className={className}>
      <div className="flex flex-col">
        <h2 className="title-2">Plan Details</h2>
        {isBlueCareEligible(visibilityRules) ? (
          <>
            <Spacer size={32} />
            <Row>
              <TextBox text="Plan Type:"></TextBox>
              <Spacer size={16} axis="horizontal" />
              <TextBox text="BlueCare Medicaid" className="font-bold" />
            </Row>
          </>
        ) : planType ? (
          <>
            {!planType?.includes(NOT_AVAILABLE) && (
              <>
                <Spacer size={32} />
                <Row>
                  <TextBox text="Plan Type:"></TextBox>
                  <Spacer size={16} axis="horizontal" />
                  <TextBox text={planType} className="body-bold" />
                </Row>
              </>
            )}
          </>
        ) : (
          <>
            <Spacer size={32} />
            <ErrorCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later. " />
          </>
        )}
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
          url="/member/idcard"
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
                  onMyPlanDetails={onMyPlanDetails}
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
                  address1={loggedInMember?.address1 ?? 'N/A'}
                  address2={loggedInMember?.cityStateZip ?? 'N/A'}
                  primaryPhoneNumber={
                    loggedInMember?.primaryPhoneNumber ?? 'N/A'
                  }
                  secondaryPhoneNumber={
                    loggedInMember?.secondaryPhoneNumber ?? 'N/A'
                  }
                />
              }
            ></Accordion>
          </Column>
        </Card>
      </div>
    </Card>
  );
};
