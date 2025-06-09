import { Card } from '@/components/foundation/Card';
import { externalIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { SpacerX } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

type ResourceMiniCardProps = {
  icon: ReactNode;
  label: string;
  link: string;
  external: boolean;
  vRules?: VisibilityRules;
  openInNewWindow?: boolean;
} & IComponent;

export const ResourceMiniCard = ({
  icon,
  label,
  link,
  external,
  className,
  vRules,
  openInNewWindow = false,
}: ResourceMiniCardProps) => {
  function getResourceForOthers() {
    return (
      <Link className={className ?? ''} href={link}>
        {getFaqCardData()}
      </Link>
    );
  }
  function getResourceForBlueCare() {
    let url = '';
    if (label === 'Find a Form') {
      url = process.env.NEXT_PUBLIC_BLUECARE_FIND_FORM_URL ?? '';
    } else if (label === 'Frequently Asked Questions') {
      url = process.env.NEXT_PUBLIC_BLUECARE_SUPPORT_FAQ_URL ?? '';
    }

    return (
      <Link
        className={className ?? ''}
        href={url}
        target="_blank"
        rel="noopener,noreferrer"
      >
        {getFaqCardData()}
      </Link>
    );
  }

  function getFaqCardData() {
    return (
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
    );
  }

  return (
    <>
      {(isBlueCareEligible(vRules) && label === 'Frequently Asked Questions') ||
      (label === 'Find a Form' && openInNewWindow)
        ? getResourceForBlueCare()
        : getResourceForOthers()}
    </>
  );
};
