import { IComponent } from '@/components/IComponent';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { formatPhone } from '@/utils/phone_formatter';
import { formatZip } from '@/utils/zipcode_formatter';
import { PrimaryCareProviderDetails } from '../model/api/primary_care_provider';

interface PrimaryCareProviderProps extends IComponent {
  linkLabel: string;
  title: string;
  label: string;
  providerDetails: PrimaryCareProviderDetails | null;
}

export const PrimaryCareProvider = ({
  title,
  label,
  providerDetails,
  linkLabel,
  className,
}: PrimaryCareProviderProps) => {
  const addressLine3 = `${toPascalCase(providerDetails?.city ?? '')} ${providerDetails?.state ?? ''} ${formatZip(providerDetails?.zip) ?? ''}`;
  return (
    <Card className={className}>
      <div>
        <Header className="title-2" text={title} />
        <Spacer size={16} />
        {providerDetails && Object.keys(providerDetails).length > 0 ? (
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
              <TextBox className="body-2 test4" text="Phone"></TextBox>
              {providerDetails.phone ? (
                <>
                  <TextBox
                    className="body-1 test5"
                    text={formatPhone(providerDetails.phone)}
                  ></TextBox>
                </>
              ) : (
                <TextBox className="body-1 test6" text="N/A"></TextBox>
              )}
            </>
          </Card>
        ) : (
          <ErrorInfoCard
            className="mt-4"
            errorText="Oops, it looks like something went wrong. Try again later."
          />
        )}
        <Spacer size={16} />
        <AppLink
          className="!text-left"
          label={linkLabel}
          url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET}`}
        />
      </div>
    </Card>
  );
};
