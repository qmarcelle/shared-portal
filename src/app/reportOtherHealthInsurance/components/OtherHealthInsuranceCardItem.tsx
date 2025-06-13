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
import { InsuranceData } from '../models/api/insurance_data';
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
  icon = <Image src={editIcon} alt="" />,
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
      {cobDetails === null ? (
        <Column>
          <section className="flex justify-start self-start">
            <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
          </section>
        </Column>
      ) : (
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
          {[
            cobDetails.medicalBean,
            cobDetails.medicareBean,
            cobDetails.dentalBean,
            cobDetails.medicareDentalBean,
            cobDetails.medicareMedicalBean,
          ].every((bean) => !bean) ? (
            <>
              <TextBox
                className="ml-2 body-1"
                text="Not covered by other health insurance."
              />
              <Spacer size={12} />
              <Row>
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
            </>
          ) : (
            [
              { bean: cobDetails.medicalBean, label: 'Medical Plan' },
              { bean: cobDetails.medicareBean, label: 'Medicare Plan' },
              { bean: cobDetails.dentalBean, label: 'Dental Plan' },
              {
                bean: cobDetails.medicareDentalBean,
                label: 'Medicare Dental Plan',
              },
              {
                bean: cobDetails.medicareMedicalBean,
                label: 'Medicare Medical Plan',
              },
            ].map(
              ({ bean, label }) =>
                bean && <>{getcobDetailsSection(bean, label)}</>,
            )
          )}
          <Spacer size={16} />
          {getHealthInsuranceContent(cobDetails.memberName)}
        </Column>
      )}
    </Card>
  );

  function getcobDetailsSection(cobBean: InsuranceData, cobBeanType: string) {
    return (
      <>
        <>
          <Spacer size={12} />
          <TextBox className="ml-2 body-1" text={cobBeanType} />
          <TextBox
            className="ml-2 body-2"
            text={cobBean.otherInsuranceCompanyName}
          />
          <TextBox className="ml-2 body-2" text={cobBean.policyIdNum} />
          <TextBox className="ml-2 body-2" text={cobBean.policyEffectiveDate} />
        </>
        <Spacer size={12} />
        <Row>
          <TextBox
            className="ml-2 body-1 inline"
            text="Last Updated:"
            display="inline"
          />
          <TextBox
            className="ml-2 body-1 inline"
            text={cobBean.lastUpdated?.toString() ?? 'N/A'}
            display="inline"
          />
        </Row>
      </>
    );
  }
};
