import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import Link from 'next/link';

interface MyHealthCardProps extends IComponent {
  label: string;
  body: string;
  icon: string | null;
  link?: string;
  openInNewWindow?: boolean;
  visibilityRule?: VisibilityRules;
}

export const MyHealthCard = ({
  className,
  label,
  body,
  icon,
  link,
  openInNewWindow = false,
  visibilityRule,
}: MyHealthCardProps) => {
  function getIcons(icon: string | null) {
    if (icon != null) {
      return (
        <Column>
          <Spacer size={8} />
          <Image className="size-10" src={icon} alt="" />
          <Spacer size={8} />
        </Column>
      );
    }
  }
  function getResourceForOthers() {
    return (
      <Link href={link ?? ''} className="my-health-card my-health-card-link">
        <>{getCardDetails()}</>
      </Link>
    );
  }

  function getHealthLibraryLinkForBlueCare() {
    return (
      <Link
        href={process.env.NEXT_PUBLIC_BLUECARE_HEALTH_LIBRARY_URL ?? ''}
        target="_blank"
        className="my-health-card my-health-card-link"
      >
        <>{getCardDetails()}</>
      </Link>
    );
  }
  function getCardDetails() {
    return (
      <Card type="main" key={label} className={className}>
        <Column className="ml-2">
          {getIcons(icon)}
          <Spacer size={16} />
          <Column>
            <TextBox className="link-row-head" text={label} />
            <Spacer size={16} />
            <TextBox className="body-1" text={body} />
          </Column>
        </Column>
      </Card>
    );
  }

  return (
    <>
      {isBlueCareEligible(visibilityRule) && openInNewWindow
        ? getHealthLibraryLinkForBlueCare()
        : getResourceForOthers()}
    </>
  );
};
