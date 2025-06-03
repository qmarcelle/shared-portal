import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface PlanContactInformationSectionProps extends IComponent {
  title: string;
  address1: string;
  address2: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
}

export const PlanContactInformationSection = ({
  title,
  address1,
  address2,
  primaryPhoneNumber,
  secondaryPhoneNumber,
}: PlanContactInformationSectionProps) => {
  return (
    <Column className="flex flex-col">
      <Spacer size={16} />
      <TextBox className="body-1" text={title}></TextBox>
      <Spacer size={32} />
      <TextBox className="body-2 mb-2" text="Mailing Address"></TextBox>
      <TextBox className="body-1" text={address1}></TextBox>
      <TextBox className="body-1" text={address2}></TextBox>
      <Spacer size={16} />
      <TextBox className="body-2" text="Primary Phone Number"></TextBox>
      <TextBox className="body-1" text={primaryPhoneNumber}></TextBox>
      <Spacer size={16} />
      <TextBox className="body-2" text="Secondary Phone Number"></TextBox>
      <TextBox className="body-1" text={secondaryPhoneNumber}></TextBox>
      <Spacer size={32} />
      <AppLink
        label="View All Plan Contact Information"
        url="/member/myplan/plancontact"
      />
    </Column>
  );
};
