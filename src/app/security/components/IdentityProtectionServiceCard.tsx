import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';

export const IdentityProtectionServiceCard = () => {
  const trackIdentityProtectionAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'view identity protection services',
      click_url: window.location.href,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
  };

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
          url="/member/myplan/benefits/identityprotection"
          callback={trackIdentityProtectionAnalytics}
        />
      </Column>
    </Card>
  );
};
