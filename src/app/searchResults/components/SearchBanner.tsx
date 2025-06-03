import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import externalIcon from '../../../../public/assets/external_white.svg';

type SearchBannerProps = {
  title: string;
  description: string;
  link: string;
  linkText: string;
  external: boolean | undefined;
};

export const SearchBanner = ({
  title,
  description,
  link,
  linkText,
  external,
}: SearchBannerProps) => {
  return (
    <Card className="searchBanner container">
      <Column>
        <Spacer size={16} />
        <Header className="title-3 pl-2" text={title} />
        <Spacer size={16} />
        <TextBox className="pl-2" text={description} />
        <Spacer size={16} />
        <AppLink
          label={linkText}
          url={link}
          className="searchBannerLink inline"
          displayStyle="inline-flex"
          icon={external && <Image src={externalIcon} alt="" />}
        />
      </Column>
    </Card>
  );
};
