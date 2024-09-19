import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { googleAnalytics } from '@/utils/analytics';

export const IdentityProtectionService = () => {
  return (
    <Card className="small-section">
      <Column>
        <Header type="title-2" text="Identity Protection Services" />
        <Spacer size={16} />
        <TextBox text="Keeping your medical information secure is more important than ever. That’s why we offer identity theft protection with our eligible plans—free of charge." />
        <Spacer size={32} />
        <AppLink
          label="View Identity Protection Services"
          className="pl-0"
          callback={() =>
            googleAnalytics(
              'view identity protection services',
              window.location.href,
              'content interaction',
              'click',
              'internal_link_click',
            )
          }
        />
      </Column>
    </Card>
  );
};
