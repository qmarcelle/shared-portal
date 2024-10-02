import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { alertBlueIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import Image from 'next/image';
import { ReactElement } from 'react';

interface LoginErrorTemplateProps extends IComponent {
  label: string;
  body: ReactElement;
  bottomNote: string;
  contactUs: string;
}

export const LoginErrorTemplate = ({
  label,
  body,
  bottomNote,
  contactUs,
}: LoginErrorTemplateProps) => {
  const trackContactUsAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'contact us',
      click_url: process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
  };

  return (
    <article id="mainSection">
      <Column className="items-center">
        <Spacer size={32} />
        <Image className="size-[80px]" src={alertBlueIcon} alt="alert" />
        <Spacer size={16} />
        <Header className="title-2" text={label} />
        <Spacer size={16} />
        {body}
        <footer>
          <p className="text-center">
            {bottomNote}{' '}
            <a
              className="link"
              href={process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL ?? ''}
              onClick={trackContactUsAnalytics}
            >
              {contactUs}
            </a>
          </p>
        </footer>
      </Column>
    </article>
  );
};
