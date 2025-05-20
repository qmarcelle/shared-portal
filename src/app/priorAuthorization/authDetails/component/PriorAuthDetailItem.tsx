import { MemberPriorAuthDetail } from '@/app/priorAuthorization/models/priorAuthData';
import { RichText } from '@/components/foundation/RichText';
import AlertIcon from '@/public/assets/alert_gray.svg';
import MedicalIcon from '@/public/assets/medical.svg';
import { formatDate } from '@/utils/inputValidator';
import { formatPhone } from '@/utils/phone_formatter';
import Image from 'next/image';
import { PriorAuthorizationHelp } from '../../../../components/composite/PriorAuthorizationHelp';
import { Card } from '../../../../components/foundation/Card';
import { Column } from '../../../../components/foundation/Column';
import { Divider } from '../../../../components/foundation/Divider';
import { Header } from '../../../../components/foundation/Header';
import { Row } from '../../../../components/foundation/Row';
import { Spacer } from '../../../../components/foundation/Spacer';
import { StatusLabel } from '../../../../components/foundation/StatusLabel';
import { TextBox } from '../../../../components/foundation/TextBox';
import { IComponent } from '../../../../components/IComponent';

interface priorAuthDetailProps extends IComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authInfo: MemberPriorAuthDetail;
  contact: string;
}

export const PriorAuthDetailItem = ({
  authInfo,
  contact,
}: priorAuthDetailProps) => {
  function getSuccessStatus() {
    switch (authInfo.statusDescription) {
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

  function getPriorAuthIcon() {
    return MedicalIcon;
  }

  return (
    <main className="flex flex-col justify-center items-center page priorAuthDetail">
      <Spacer size={32}></Spacer>
      <Column className={'app-content app-base-font-color m-5'}>
        <Row className="md:max-my-8">
          <Image
            src={getPriorAuthIcon()}
            className="icon !w-10 !h-10 w-fit"
            alt="Medical"
          />
          <Spacer axis="horizontal" size={8} />
          <Header
            type="title-3"
            text={authInfo.serviceGroupDescription ?? ''}
            className="md:text-3xl !font-light ml-5 w-3/5 mb-4"
          />
        </Row>
        <Column className="statusDetail">
          <StatusLabel
            label={authInfo.statusDescription ?? ''}
            status={getSuccessStatus()}
          />
          <TextBox
            type="body-1"
            className="mt-4"
            text={'Visited on ' + formatDate(authInfo.fromDate)}
          ></TextBox>
          <TextBox
            type="body-1"
            className="mt-4"
            text={'For ' + authInfo.firstName + ' ' + authInfo.lastName}
          ></TextBox>
          <TextBox
            type="body-1"
            className="mt-4"
            text={'Reference ID : ' + authInfo.referenceId}
          ></TextBox>
        </Column>
      </Column>
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            {(authInfo.statusDescription === 'PartialApproval' ||
              authInfo.statusDescription === 'Denied') && (
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
                    <RichText
                      type="body-1"
                      className="mt-4"
                      spans={[
                        <span key={0}>For more information,Please</span>,
                        <span className="link" key={1}>
                          <a> start a chat </a>
                        </span>,
                        <span key={2}>or call us at [{contact}]</span>,
                      ]}
                    />
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
                    {(authInfo.statusDescription === 'PartialApproval' ||
                      authInfo.statusDescription === 'Approved') && (
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
                    {(authInfo.statusDescription === 'Denied' ||
                      authInfo.statusDescription === 'Pending') && (
                      <Column className="w-52">
                        <TextBox
                          type="body-1"
                          className="font-bold mt-4"
                          text={authInfo.getProviderReferredBy.name}
                        ></TextBox>
                        <TextBox
                          type="body-2"
                          className="mt-4"
                          text="Facility Address"
                        ></TextBox>
                        <TextBox
                          type="body-1"
                          className="mt-4"
                          text={authInfo.getProviderReferredBy.streetAddress1}
                        ></TextBox>

                        <TextBox
                          type="body-2"
                          className="mt-4"
                          text="Phone"
                        ></TextBox>
                        <TextBox
                          type="body-1"
                          className="mt-4"
                          text={formatPhone(
                            authInfo.getProviderReferredBy.phoneNumber,
                          )}
                        ></TextBox>
                      </Column>
                    )}
                  </Column>
                  <Column>
                    <Header type="title-3" text="Referred To:" />
                    {(authInfo.statusDescription === 'Denied' ||
                      authInfo.statusDescription === 'Approved') && (
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
                    {(authInfo.statusDescription === 'PartialApproval' ||
                      authInfo.statusDescription === 'Pending') && (
                      <Column className="w-52">
                        <TextBox
                          type="body-1"
                          className="font-bold mt-4"
                          text={authInfo.getProviderReferredTo.name}
                        ></TextBox>
                        <TextBox
                          type="body-2"
                          className="mt-4"
                          text="Facility Address"
                        ></TextBox>
                        <TextBox
                          type="body-1"
                          className="mt-4"
                          text={authInfo.getProviderReferredTo.streetAddress1}
                        ></TextBox>

                        <TextBox
                          type="body-2"
                          className="mt-4"
                          text="Phone"
                        ></TextBox>
                        <TextBox
                          type="body-1"
                          className="mt-4"
                          text={formatPhone(
                            authInfo.getProviderReferredTo.phoneNumber,
                          )}
                        ></TextBox>
                      </Column>
                    )}
                  </Column>
                </Column>
                <Divider />
                <Row>
                  {(authInfo.statusDescription === 'PartialApproval' ||
                    authInfo.statusDescription === 'Approved' ||
                    authInfo.statusDescription === 'Denied') && (
                    <Column className="w-52">
                      <Header
                        type="title-3"
                        text="Provider Facility:"
                        className="my-8"
                      />
                      <TextBox
                        type="body-1"
                        className="font-bold"
                        text={authInfo.getProviderFacilityId?.name ?? ''}
                      ></TextBox>
                      <TextBox
                        type="body-2"
                        className="mt-4"
                        text="Facility Address"
                      ></TextBox>
                      <TextBox
                        type="body-1"
                        className="mt-4"
                        text={
                          authInfo.getProviderFacilityId?.streetAddress1 ?? ''
                        }
                      ></TextBox>

                      <TextBox
                        type="body-2"
                        className="mt-4"
                        text="Phone"
                      ></TextBox>
                      <TextBox
                        type="body-1"
                        className="mt-4"
                        text={
                          formatPhone(
                            authInfo.getProviderFacilityId?.phoneNumber,
                          ) ?? ''
                        }
                      ></TextBox>
                    </Column>
                  )}
                  <Column>
                    {authInfo.statusDescription === 'Pending' && (
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
            <PriorAuthorizationHelp contact={contact} />
          </Column>
        </section>
        <Spacer size={32}></Spacer>
      </Column>
    </main>
  );
};
