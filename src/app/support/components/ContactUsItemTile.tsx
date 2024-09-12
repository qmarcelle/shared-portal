import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { ReactNode } from 'react';

type ContactUsItemTileProps = {
  icon: ReactNode;
  label: string;
  body: ReactNode;
  footer: ReactNode;
};

export const ContactUsItemTile = ({
  icon,
  label,
  body,
  footer,
}: ContactUsItemTileProps) => {
  return (
    <Column className="gap-2 sm:basis-0 grow shrink sm:shrink-0">
      {icon}
      <TextBox type="title-3" className="!font-bold" text={label} />
      {body}
      {footer}
    </Column>
  );
};
