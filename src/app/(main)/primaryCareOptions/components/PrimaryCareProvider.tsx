import { IComponent } from '../../../../components/IComponent';
import { AppLink } from '../../../../components/foundation/AppLink';
import { Card } from '../../../../components/foundation/Card';
import { Header } from '../../../../components/foundation/Header';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';

interface PrimaryCareProviderProps extends IComponent {
  memberName: string;
  address: string;
  primaryPhoneNumber: string;
  linkLabel: string;
  title: string;
  label: string;
}

export const PrimaryCareProvider = ({
  title,
  label,
  memberName,
  address,
  primaryPhoneNumber,
  linkLabel,
  className,
}: PrimaryCareProviderProps) => {
  return (
    <Card className={className}>
      <div>
        <Header className="title-2" text={title} />
        <Spacer size={16} />
        <Card className={className}>
          <div>
            <TextBox className="body-1 font-bold" text={memberName}></TextBox>
            <TextBox className="body-1" text={label}></TextBox>
            <Spacer size={16} />
            <TextBox className="body-2" text="Facility Address"></TextBox>
            <TextBox className="body-1" text={address}></TextBox>
            <Spacer size={16} />
            <TextBox className="body-2" text="Phone"></TextBox>
            <TextBox className="body-1" text={primaryPhoneNumber}></TextBox>
          </div>
        </Card>
        <Spacer size={16} />
        <AppLink label={linkLabel} />
      </div>
    </Card>
  );
};
