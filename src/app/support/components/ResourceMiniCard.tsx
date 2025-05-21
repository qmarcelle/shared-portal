import { Card } from '@/components/foundation/Card';
import { externalIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { SpacerX } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

type ResourceMiniCardProps = {
  icon: ReactNode;
  label: string;
  link: string;
  external: boolean;
} & IComponent;

export const ResourceMiniCard = ({
  icon,
  label,
  link,
  external,
  className,
}: ResourceMiniCardProps) => {
  return (
    <Link className={className ?? ''} href={link}>
      <Card className="px-4 py-3">
        <Row className="items-center">
          {icon}
          <SpacerX size={16} />
          <div>
            <p className="link inline !no-underline">{label}</p>
            {external && <Image className="inline" src={externalIcon} alt="" />}
          </div>
        </Row>
      </Card>
    </Link>
  );
};
