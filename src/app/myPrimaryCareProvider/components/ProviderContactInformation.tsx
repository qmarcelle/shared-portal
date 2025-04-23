import { PrimaryCareProviderDetails } from '@/app/findcare/primaryCareOptions/model/api/primary_care_provider';
import { IComponent } from '@/components/IComponent';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import editIcon from '@/public/assets/edit.svg';
import emptyStateDocument from '@/public/assets/empty_state_document.svg';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { formatPhone } from '@/utils/phone_formatter';
import { formatZip } from '@/utils/zipcode_formatter';
import Image from 'next/image';

interface ProviderContactInformationProps extends IComponent {
  icon?: JSX.Element;
  label: string;
  providerDetails: PrimaryCareProviderDetails | null;
}

export const ProviderContactInformation = ({
  label,
  providerDetails,
  className,
  icon = <Image src={editIcon} alt="link" />,
}: ProviderContactInformationProps) => {
  const addressLine3 = `${toPascalCase(providerDetails?.city ?? '')} ${providerDetails?.state ?? ''} ${formatZip(providerDetails?.zip) ?? ''}`;
  return (
    <>
      {providerDetails &&
      providerDetails != undefined &&
      Object.keys(providerDetails).length > 0 &&
      providerDetails.name != '' ? (
        <Card className={className}>
          <div>
            {providerDetails?.name && (
              <TextBox type="title-2" text={providerDetails?.name} />
            )}
            {providerDetails?.dob && (
              <Row>
                <TextBox type="title-2" text="DOB: " />
                <TextBox type="title-2" text={providerDetails?.dob} />
              </Row>
            )}
            <Spacer size={16} />
            {providerDetails.physicianName != '' &&
            providerDetails.physicianName != null ? (
              <Card className={className}>
                <>
                  <TextBox
                    className="body-1 font-bold"
                    text={providerDetails?.physicianName}
                  ></TextBox>
                  <TextBox className="body-1" text={label}></TextBox>
                  <Spacer size={16} />
                  <TextBox className="body-2" text="Facility Address"></TextBox>
                  {providerDetails.address1 ||
                  providerDetails.address2 ||
                  providerDetails.city ||
                  providerDetails.state ||
                  providerDetails.zip ? (
                    <>
                      {providerDetails.address1 && (
                        <TextBox
                          className="body-1 test1"
                          text={toPascalCase(providerDetails.address1)}
                        ></TextBox>
                      )}
                      {providerDetails.address2 && (
                        <TextBox
                          className="body-1 test2"
                          text={toPascalCase(providerDetails.address2)}
                        ></TextBox>
                      )}
                      {addressLine3 && (
                        <TextBox
                          className="body-1 test3"
                          text={addressLine3}
                        ></TextBox>
                      )}
                    </>
                  ) : (
                    <TextBox className="body-1 test1" text="N/A"></TextBox>
                  )}
                  <Spacer size={16} />
                  {providerDetails.phone && (
                    <>
                      <TextBox className="body-2" text="Phone"></TextBox>
                      <TextBox
                        className="body-1"
                        text={formatPhone(providerDetails.phone)}
                      ></TextBox>
                    </>
                  )}
                  <Spacer size={8} />
                  <AppLink
                    className="font-bold primary-color !flex link !no-underline ml-0 pl-0"
                    label="Update"
                    icon={icon}
                    url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET}`}
                  />
                </>
              </Card>
            ) : (
              <Card className="neutral container mb-4">
                <Column className="flex flex-row align-top m-4">
                  <Row>
                    <Image
                      src={emptyStateDocument}
                      className="icon !w-10 !h-10"
                      alt="emptyStateDocument"
                    />
                    <Spacer axis="horizontal" size={8} />
                    <TextBox
                      type="body-1"
                      className=""
                      text="We don't have a Primary Care Provider listed for you or someone on your plan. If you already have a doctor or need to find one, we'll help you get set up."
                    ></TextBox>
                  </Row>
                  <Spacer size={8} />
                  <AppLink
                    className="font-bold primary-color !flex ml-10"
                    url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET}`}
                    label="Add a Provider"
                  />
                </Column>
              </Card>
            )}
          </div>
        </Card>
      ) : (
        <ErrorInfoCard
          className="mt-4"
          errorText="Oops, it looks like something went wrong. Try again later."
        />
      )}
    </>
  );
};
