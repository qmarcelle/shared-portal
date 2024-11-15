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
  const addressLine3 = `${toPascalCase(providerDetails?.city ?? '')} ${providerDetails?.state} ${formatZip(providerDetails?.zip)}`;
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
              {providerDetails.address1 && (
                <TextBox
                  className="body-1"
                  text={toPascalCase(providerDetails.address1)}
                ></TextBox>
              )}
              {providerDetails.address2 && (
                <TextBox
                  className="body-1"
                  text={toPascalCase(providerDetails.address2)}
                ></TextBox>
              )}
              {addressLine3 && (
                <TextBox className="body-1" text={addressLine3}></TextBox>
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
            </>
          </Card>
        ) : (
          <ErrorInfoCard
            className="mt-4"
            errorText="Oops, it looks like something went wrong. Try again later."
          />
        )}
        <Spacer size={16} />
        <AppLink label={linkLabel} url="/myPrimaryCareProvider" />
      </div>
    </Card>
  );
};
