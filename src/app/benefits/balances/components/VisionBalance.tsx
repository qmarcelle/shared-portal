import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { ReactNode } from 'react';

interface VisionBalanceProps extends IComponent {
  linkURL: string;
  icon?: ReactNode;
}

export const VisionBalance = ({
  className,
  linkURL,
  icon = <Image alt="external icon" src={externalIcon} />,
}: VisionBalanceProps) => {
  return (
    <Card className={className}>
      <div>
        <Header className="title-2" text="Vision Balance" />
        <Spacer size={21} />
        <TextBox
          className="inline"
          text="We work with EyeMed to provide your vision benefits. To manage your vision plan, "
        />
        <AppLink
          icon={icon}
          label="visit EyeMed"
          displayStyle="inline-flex"
          className="p-0"
          url={linkURL}
        />
        .
      </div>
    </Card>
  );
};
