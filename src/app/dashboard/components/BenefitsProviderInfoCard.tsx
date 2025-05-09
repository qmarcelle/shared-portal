import { BenefitsProviderInfo } from '@/app/dashboard/models/BenefitsProviderInfo';
import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';

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
      <a className="p-4 block" href={url}>
        {url != null ? (
          <Title
            className="body-bold primary-color"
            text={providedBy}
            suffix={<img src="/assets/external.svg" alt="external" />}
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
