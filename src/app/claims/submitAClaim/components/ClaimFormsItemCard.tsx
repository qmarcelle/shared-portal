import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import downloadIcon from '@/public/assets/download.svg';
import Image from 'next/image';

// ClaimFormsItemCard Props
interface ClaimFormsItemCardProps extends IComponent {
  title: string;
  description: string;
  icon?: JSX.Element;
  url?: string;
}

export const ClaimFormsItemCard = ({
  title,
  description,
  url,
}: ClaimFormsItemCardProps) => {
  return (
    <Column>
      <Row>
        <AppLink label={title} className="pl-0" url={url} />
        <Image src={downloadIcon} alt="" />
      </Row>
      <Spacer size={16} />
      <TextBox className="body-1" text={description} />
      <Spacer size={32} />
    </Column>
  );
};
