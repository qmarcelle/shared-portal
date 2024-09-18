import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';

interface MyHealthCardProps extends IComponent {
  label: string;
  body: string;
  icon: string | null;
  link?: string;
}

export const MyHealthCard = ({
  className,
  label,
  body,
  icon,
  link,
}: MyHealthCardProps) => {
  function getIcons(icon: string | null) {
    if (icon != null) {
      return (
        <Column>
          <Spacer size={8} />
          <Image className="size-10" src={icon} alt="link" />
          <Spacer size={8} />
        </Column>
      );
    }
  }

  return (
    <a href={link} className="my-health-card my-health-card-link">
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
    </a>
  );
};
