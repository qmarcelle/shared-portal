import { BenefitsProviderInfo } from '@/app/dashboard/models/BenefitsProviderInfo';
import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import externalIcon from '../../../../public/assets/external.svg';

interface BenefitsProviderInfoCardProps
  extends IComponent,
    BenefitsProviderInfo {}

export const BenefitsProviderInfoCard = ({
  contact,
  providedBy,
  url,
  className,
}: BenefitsProviderInfoCardProps) => {
  return (
    <Card className={`${className}`}>
      <a className="p-4 block" href={url} target="_blank">
        {url != null ? (
          <Title
            className="body-bold primary-color"
            text={providedBy}
            suffix={<Image src={externalIcon} alt="" />}
          />
        ) : (
          <TextBox text={providedBy} className="body-1 body-bold" />
        )}
        <Spacer size={16} />
        {contact && <TextBox text={contact} />}
      </a>
    </Card>
  );
};
