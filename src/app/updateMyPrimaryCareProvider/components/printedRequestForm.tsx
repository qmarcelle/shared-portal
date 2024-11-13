import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { downloadIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';

interface PrintedRequestFormProps extends IComponent {
  icon?: JSX.Element;
}

export const PrintedRequestForm = ({
  icon = <Image src={downloadIcon} alt="link" />,
}: PrintedRequestFormProps) => {
  return (
    <Card className="m-4 p-8">
      <Column>
        <Header
          className="title-2"
          text="Option 3: Complete & Mail a Printed Request Form"
        />
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text="You can download, fill out and complete a print form in order to request to add or update your primary care provider. If there are any issues with your request, we'll contact you."
        />
        <Spacer size={32} />
        <AppLink
          label="Primary Care Provider Change Form"
          icon={icon}
          className="!flex pl-0"
        />
      </Column>
    </Card>
  );
};
