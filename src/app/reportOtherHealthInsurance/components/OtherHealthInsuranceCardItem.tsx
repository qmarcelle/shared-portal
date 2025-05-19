import { MemberData } from '@/actions/loggedUserInfo';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { ChildAppModalBody } from '@/components/foundation/ChildAppModalBody';
import { AddMemberDetails } from '@/models/add_member_details';
import Image from 'next/image';
import editIcon from '../../../../public/assets/edit.svg';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Divider } from '../../../components/foundation/Divider';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';
import { Title } from '../../../components/foundation/Title';
import { OtherHealthInsurance } from '../journeys/OtherHealthInsurance';
import { OtherHealthInsuranceDetails } from '../models/api/otherhealthinsurance_details';

interface OtherHealthInsuranceCardItemProps extends IComponent {
  icon?: JSX.Element;
  icon1?: JSX.Element;
  memberDetails: AddMemberDetails[];
  cobDetails: OtherHealthInsuranceDetails;
  membersData: MemberData[];
}

export const OtherHealthInsuranceCardItem = ({
  onClick,
  className,
  icon = <Image src={editIcon} alt="link" />,
  memberDetails,
  cobDetails,
  membersData,
}: OtherHealthInsuranceCardItemProps) => {
  const { showAppModal, dismissModal, dismissChildModal } = useAppModalStore();
  function getHealthInsuranceContent(memberName: string) {
    return (
      <Column>
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Title
            className="font-bold primary-color"
            text="Update"
            suffix={icon}
            callback={() =>
              showAppModal({
                content: (
                  <OtherHealthInsurance
                    memberDetails={memberDetails}
                    membersData={membersData}
                    selectedName={memberName}
                  />
                ),
                isChildActionAppModal: true,
                childModalContent: (
                  <ChildAppModalBody
                    key="first"
                    label="Are you sure you want to exit?"
                    subLabel="Any information you entered will not be saved."
                    primaryButtonLabel="Return to Form"
                    secondaryButtonLabel="Exit Anyway"
                    primaryButtonCallback={dismissChildModal}
                    secondaryButtonCallback={dismissModal}
                  />
                ),
              })
            }
          />
          <Spacer size={40} />
        </Row>
      </Column>
    );
  }

  return (
    <Card
      className={`cursor-pointer ${className}`}
      type="elevated"
      onClick={onClick}
    >
      {cobDetails != null ? (
        <Column className="m-4">
          <Spacer size={16} />
          <Row className="justify-between">
            <TextBox
              className="ml-2 font-bold body-1"
              text={cobDetails.memberName}
            />
          </Row>
          <Spacer size={16} />
          <Row className="ml-2">
            <TextBox text={'DOB: ' + cobDetails.dob} />
          </Row>
          <Spacer size={16} />
          <Row>
            <Spacer axis="horizontal" size={8} />
            <Divider />
          </Row>
          <Spacer size={16} />
          {cobDetails.medicalBean != null ||
          cobDetails.medicareBean != null ||
          cobDetails.dentalBean != null ||
          cobDetails.medicareDentalBean != null ||
          cobDetails.medicareMedicalBean != null ? (
            <Row>
              {cobDetails.medicareBean && (
                <>
                  <TextBox className="ml-2 body-1" text="Medicare Plan" />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicareBean.otherInsuranceCompanyName}
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicareBean.policyIdNum}
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicareBean.policyEffectiveDate}
                  />
                </>
              )}
              {cobDetails.dentalBean && (
                <>
                  <TextBox className="ml-2 body-1" text="Dental Plan" />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.dentalBean.otherInsuranceCompanyName}
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.dentalBean.policyIdNum}
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.dentalBean.policyEffectiveDate}
                  />
                </>
              )}
              {cobDetails.medicalBean && (
                <>
                  <TextBox className="ml-2 body-1" text="Medical Plan" />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicalBean.otherInsuranceCompanyName}
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicalBean.policyIdNum}
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicalBean.policyEffectiveDate}
                  />
                </>
              )}
              {cobDetails.medicareMedicalBean && (
                <>
                  <TextBox
                    className="ml-2 body-1"
                    text="Medicare Medical Plan"
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={
                      cobDetails.medicareMedicalBean.otherInsuranceCompanyName
                    }
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicareMedicalBean.policyIdNum}
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicareMedicalBean.policyEffectiveDate}
                  />
                </>
              )}
              {cobDetails.medicareDentalBean && (
                <>
                  <TextBox
                    className="ml-2 body-1"
                    text="Medicare Dental Plan"
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={
                      cobDetails.medicareDentalBean.otherInsuranceCompanyName
                    }
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicareDentalBean.policyIdNum}
                  />
                  <TextBox
                    className="ml-2 body-2"
                    text={cobDetails.medicareDentalBean.policyEffectiveDate}
                  />
                </>
              )}
              <Spacer size={12} />
              <TextBox
                className="ml-2 body-1 inline"
                text="Last Updated:"
                display="inline"
              />
              <TextBox
                className="ml-2 body-1 inline"
                text={cobDetails.lastUpdated?.toString() ?? 'N/A'}
                display="inline"
              />
            </Row>
          ) : (
            <Row>
              <TextBox
                className="ml-2 body-1"
                text="Not covered by other health insurance."
              />
              <Spacer size={12} />
              <TextBox
                className="ml-2 body-1 inline"
                text="Last Updated:"
                display="inline"
              />
              <TextBox
                className="ml-2 body-1 inline"
                text="N/A"
                display="inline"
              />
            </Row>
          )}
          <Spacer size={16} />
          {getHealthInsuranceContent(cobDetails.memberName)}
        </Column>
      ) : (
        <>
          <Column>
            <section className="flex justify-start self-start p-4">
              <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
            </section>
          </Column>
        </>
      )}
    </Card>
  );
};
