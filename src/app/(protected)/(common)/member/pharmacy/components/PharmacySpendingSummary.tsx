import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface PharmacySpendingSummaryProps extends IComponent {
  title: string;
  description: string;
  linkLabel: string;
  url?: string;
}

export const PharmacySpendingSummary = ({
  title,
  description,
  className,
  linkLabel,
  url,
}: PharmacySpendingSummaryProps) => {
  return (
    <Card className={className}>
      <Column>
        <h2 className="title-2">{title}</h2>
        <Spacer size={16} />
        <TextBox type="body-1" text={description} />

        <Spacer size={32} />
        <AppLink
          className="!flex p-0"
          label={linkLabel}
          callback={() => null}
          url={url}
        />
      </Column>
    </Card>
  );
};
