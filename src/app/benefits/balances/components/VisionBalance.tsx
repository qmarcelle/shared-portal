import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import { ReactNode } from 'react';

interface VisionBalanceProps extends IComponent {
  linkURL: string;
  icon?: ReactNode;
}

export const VisionBalance = ({
  className,
  linkURL,
  icon = <Image alt="" src={externalIcon} />,
}: VisionBalanceProps) => {
  return (
    <Card className={className}>
      <div>
        <Header className="title-2" text="Vision Balance" />
        <Spacer size={21} />
        <RichText
          type="body-1"
          spans={[
            <span key={0}>
              We work with EyeMed to provide your vision benefits. To manage
              your vision plan,{' '}
            </span>,
            <span className="font-bold link" key={1}>
              <AppLink
                icon={icon}
                label="visit EyeMed"
                displayStyle="inline-flex"
                className="p-0"
                url={linkURL}
              />
            </span>,
            <span key={2}>.</span>,
          ]}
        />
      </div>
    </Card>
  );
};
