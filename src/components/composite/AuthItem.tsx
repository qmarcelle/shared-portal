import Image from 'next/image';
import AlertIcon from '/assets/alert_gray.svg';
import DentalIcon from '/assets/dental.svg';
import MedicalIcon from '/assets/medical.svg';
import PharmacyIcon from '/assets/pharmacy.svg';
import VisionIcon from '/assets/vision.svg';
import { PriorAuthorizationHelp } from '../composite/PriorAuthorizationHelp';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { Header } from '../foundation/Header';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { StatusLabel } from '../foundation/StatusLabel';
import { TextBox } from '../foundation/TextBox';
import { IComponent } from '../IComponent';

interface priorAuthDetailProps extends IComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authInfo: any;
}

export const AuthItem = ({ authInfo }: priorAuthDetailProps) => {
  function getSuccessStatus() {
    switch (authInfo.priorAuthDetailStatus) {
      case 'Processed':
        return 'success';
      case 'Denied':
        return 'error';
      case 'Pending':
        return 'neutral';
      case 'PartialApproval':
        return 'partialapproval';
      case 'Approved':
        return 'success';
      default:
        return 'empty';
    }
  }

  function getClaimIcon() {
    if (authInfo.priorAuthDetailType == 'Medical') {
      return MedicalIcon;
    } else if (authInfo.priorAuthDetailType == 'Dental') {
      return DentalIcon;
    } else if (authInfo.priorAuthDetailType == 'Vision') {
      return VisionIcon;
    } else {
      return PharmacyIcon;
    }
  }

  return (
    <main className="flex flex-col justify-center items-center page priorAuthDetail">
      <Spacer size={32}></Spacer>
      <Column className={'app-content app-base-font-color m-5'}>
        <Row className="md:max-my-8">
          <Image
            src={getClaimIcon()}
            className="icon !w-10 !h-10 w-fit"
            alt={authInfo.priorAuthDetailType}
          />
          <Spacer axis="horizontal" size={8} />
          <Header
            type="title-3"
            text={authInfo.priorAuthDetailName}
            className="md:text-3xl !font-light ml-5 w-3/5 mb-4"
          />
        </Row>
        <Column className="statusDetail">
          <StatusLabel
            label={authInfo.priorAuthDetailStatus}
            status={getSuccessStatus()}
          />
          <TextBox
            type="body-1"
            className="mt-4"
            text={'Visited on ' + authInfo.dateOfVisit}
          ></TextBox>
          <TextBox
            type="body-1"
            className="mt-4"
            text={'For ' + authInfo.member}
          ></TextBox>
          <TextBox
            type="body-1"
            className="mt-4"
            text={'Reference ID : ' + authInfo.PriorAuthReferenceId}
          ></TextBox>
        </Column>
      </Column>
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            {(authInfo.priorAuthDetailStatus === 'PartialApproval' ||
              authInfo.priorAuthDetailStatus === 'Denied') && (
              <Card className="neutral container mb-4">
                <Column className="flex flex-row align-top m-4">
                  <Row>
                    <Image src={AlertIcon} className="icon" alt="alert" />
                    <Spacer axis="horizontal" size={8} />
                    <TextBox
                      type="body-1"
                      className="font-bold"
                      text="Get Help Understanding Partial Approvals."
                    ></TextBox>
                  </Row>

                  <Row className="flex flex-col flex-grow mt-4">
                    <TextBox
                      type="body-1"
                      text="We've been able to approve part of this request. We will
                      send you a letter explaining why and details on how to ask
                      for an appeal."
                    ></TextBox>
                    <TextBox
                      type="body-1"
                      className="mt-4"
                      text="For more information,Please start to chart or call
                      [1-800-000-000]."
                    ></TextBox>
                  </Row>
                </Column>
              </Card>
            )}
            <Card className="mb-8 p-8">
              <Column>
                <Header type="title-2" text="Service Details" />
                <Spacer size={16} />
                <Column className="mb-8 md:flex-row">
                  <Column className="mr-7">
                    <Header type="title-3" text="Referred By:" />
                    {(authInfo.priorAuthDetailStatus === 'PartialApproval' ||
                      authInfo.priorAuthDetailStatus === 'Approved') && (
                      <Card className="neutral container mt-4">
                        <Row className="flex flex-row align-top m-4">
                          <TextBox
                            className="w-4/5"
                            type="body-1"
                            text="Provider Information Unavailable."
                          ></TextBox>
                        </Row>
                      </Card>
                    )}
                    {(authInfo.priorAuthDetailStatus === 'Denied' ||
                      authInfo.priorAuthDetailStatus === 'Pending') && (
                      <Column className="w-52">
                        <TextBox
                          type="body-1"
                          className="font-bold mt-4"
                          text={authInfo.referredName}
                        ></TextBox>
                        <TextBox
                          type="body-2"
                          className="mt-4"
                          text="Facility Address"
                        ></TextBox>
                        <TextBox
                          type="body-1"
                          className="mt-4"
                          text="123 Street Address Road City Town, TN 12345"
                        ></TextBox>

                        <TextBox
                          type="body-2"
                          className="mt-4"
                          text="Phone"
                        ></TextBox>
                        <TextBox
                          type="body-1"
                          className="mt-4"
                          text="(123) 456-7890"
                        ></TextBox>
                      </Column>
                    )}
                  </Column>
                  <Column>
                    <Header type="title-3" text="Referred To:" />
                    {(authInfo.priorAuthDetailStatus === 'Denied' ||
                      authInfo.priorAuthDetailStatus === 'Approved') && (
                      <Card className="neutral container mt-4">
                        <Row className="flex flex-row align-top m-4">
                          <TextBox
                            type="body-1"
                            className="w-4/5"
                            text="Provider Information Unavailable."
                          ></TextBox>
                        </Row>
                      </Card>
                    )}
                    {(authInfo.priorAuthDetailStatus === 'PartialApproval' ||
                      authInfo.priorAuthDetailStatus === 'Pending') && (
                      <Column className="w-52">
                        <TextBox
                          type="body-1"
                          className="font-bold mt-4"
                          text={authInfo.referredName}
                        ></TextBox>
                        <TextBox
                          type="body-2"
                          className="mt-4"
                          text="Facility Address"
                        ></TextBox>
                        <TextBox
                          type="body-1"
                          className="mt-4"
                          text="123 Street Address Road City Town, TN 12345"
                        ></TextBox>

                        <TextBox
                          type="body-2"
                          className="mt-4"
                          text="Phone"
                        ></TextBox>
                        <TextBox
                          type="body-1"
                          className="mt-4"
                          text="(123) 456-7890"
                        ></TextBox>
                      </Column>
                    )}
                  </Column>
                </Column>
                <Divider />
                <Row>
                  {(authInfo.priorAuthDetailStatus === 'PartialApproval' ||
                    authInfo.priorAuthDetailStatus === 'Approved' ||
                    authInfo.priorAuthDetailStatus === 'Denied') && (
                    <Column className="w-52">
                      <Header
                        type="title-3"
                        text="Provider Facility"
                        className="my-8"
                      />
                      <TextBox
                        type="body-1"
                        className="font-bold"
                        text="Local Care Hospital"
                      ></TextBox>
                      <TextBox
                        type="body-2"
                        className="mt-4"
                        text="Facility Address"
                      ></TextBox>
                      <TextBox
                        type="body-1"
                        className="mt-4"
                        text="123 Street Address Road City Town, TN 12345"
                      ></TextBox>

                      <TextBox
                        type="body-2"
                        className="mt-4"
                        text="Phone"
                      ></TextBox>
                      <TextBox
                        type="body-1"
                        className="mt-4"
                        text="(123) 456-7890"
                      ></TextBox>
                    </Column>
                  )}
                  <Column>
                    {authInfo.priorAuthDetailStatus === 'Pending' && (
                      <Card className="neutral container mt-4">
                        <Row className="flex flex-row align-top m-4">
                          <TextBox
                            className="w-4/5"
                            type="body-1"
                            text="Provider Information Unavailable."
                          ></TextBox>
                        </Row>
                      </Card>
                    )}
                  </Column>
                </Row>
              </Column>
            </Card>
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch md:mt-0">
            <PriorAuthorizationHelp />
          </Column>
        </section>
        <Spacer size={32}></Spacer>
      </Column>
    </main>
  );
};
