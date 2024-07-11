import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import externalIcon from '../../../../public/assets/External-White.svg';
import Image from 'next/image';

export const SearchBanner = () => {
  return (
    <Card className="searchBanner container">
      <Column>
        <Spacer size={16} />
        <Header className="title-3" text="Talk With a Care Provider" />
        <Spacer size={16} />
        <TextBox text="Schedule an appointment or get health information 24/7 for non-emergency conditions." />
        <Spacer size={32} />
        <AppLink
          label="Get Started with Teladoc Health"
          className="searchBannerLink"
          icon={<Image src={externalIcon} alt="external" />}
        />
      </Column>
    </Card>
  );
};
