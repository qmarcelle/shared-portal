import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import editIcon from '@/public/assets/edit.svg';
interface ProviderInfoItemProps extends IComponent {
  icon?: JSX.Element;
}

export const ProviderInfoItem = ({
  icon = <img src={editIcon} alt="link" />,
}: ProviderInfoItemProps) => {
  return (
    <Card className="card-main large-section">
      <Column>
        <Header text="Chris Hall" className="title-3" />
        <Spacer size={8} />
        <TextBox text="DOB : 01/01/2005" />
        <Spacer size={8} />
        <Divider />
        <Spacer size={32} />
        <Card className="card-elevated cursor-pointer mb-4">
          <Column className="flex flex-row align-top m-4">
            <Column className="w-52">
              <TextBox
                type="body-1"
                className="font-bold mt-4"
                text="John Hopkins"
              ></TextBox>
              <TextBox
                type="body-1"
                className="font-bold mt-4"
                text="Primary Care Provider"
              ></TextBox>
              <TextBox
                type="body-2"
                className="mt-4"
                text="Facility Address"
              ></TextBox>
              <TextBox
                type="body-1"
                className="mt-4"
                text="John Hopkins Medical Center 123 Street Address Road City Town, TN 12345"
              ></TextBox>
              <TextBox type="body-2" className="mt-4" text="Phone"></TextBox>
              <TextBox
                type="body-1"
                className="mt-4"
                text="(123) 456-7890"
              ></TextBox>
              <Spacer size={8} />

              <AppLink
                className="font-bold primary-color !flex link !no-underline ml-0 pl-0"
                label="Update"
                icon={icon}
                url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET}`}
              />
            </Column>
          </Column>
        </Card>
      </Column>
    </Card>
  );
};
