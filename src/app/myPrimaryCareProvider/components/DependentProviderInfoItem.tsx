import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import editIcon from '@/public/assets/edit.svg';
import Image from 'next/image';
interface DependentProviderInfoItemProps extends IComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providerInfo: any;
  icon?: JSX.Element;
}

export const DependentProviderInfoItem = ({
  providerInfo,
  icon = <Image src={editIcon} alt="link" />,
}: DependentProviderInfoItemProps) => {
  return (
    <Card className="card-main large-section">
      <Column>
        <Header text={providerInfo.memberName} className="title-3" />
        <Spacer size={8} />
        <TextBox text={'DOB: ' + providerInfo.DOB} />
        <Spacer size={8} />
        <Divider />
        <Spacer size={32} />
        <Card className="card-elevated cursor-pointer mb-4">
          <Column className="flex flex-row align-top m-4">
            <Column className="w-52">
              <TextBox
                type="body-1"
                className="font-bold mt-4"
                text={providerInfo.providerName}
              ></TextBox>
              <TextBox
                type="body-1"
                className="font-bold mt-4"
                text={providerInfo.providerType}
              ></TextBox>
              <TextBox
                type="body-2"
                className="mt-4"
                text="Facility Address"
              ></TextBox>
              <TextBox
                type="body-1"
                className="mt-4"
                text={providerInfo.facilityAddress}
              ></TextBox>
              <TextBox type="body-2" className="mt-4" text="Phone"></TextBox>
              <TextBox
                type="body-1"
                className="mt-4"
                text={providerInfo.phone}
              ></TextBox>
              <Spacer size={8} />
              <AppLink
                className="font-bold primary-color !flex link !no-underline ml-0 pl-0"
                label="Update"
                icon={icon}
                url="/member/myhealth/primarycare"
              />
            </Column>
          </Column>
        </Card>
      </Column>
    </Card>
  );
};
