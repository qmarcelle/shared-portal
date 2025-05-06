import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import externalIcon from '/assets/external_white.svg';

export const SearchBanner = () => {
  return (
    <Card className="searchBanner container">
      <Column>
        <Spacer size={16} />
        <Header className="title-3 pl-2" text="Talk With a Care Provider" />
        <Spacer size={16} />
        <TextBox
          className="pl-2"
          text="Schedule an appointment or get health information 24/7 for non-emergency conditions."
        />
        <Spacer size={16} />
        <AppLink
          label="Get Started with Teladoc Health"
          className="searchBannerLink inline"
          displayStyle="inline-flex"
          icon={<Image src={externalIcon} alt="external" />}
        />
      </Column>
    </Card>
  );
};
