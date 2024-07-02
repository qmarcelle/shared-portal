import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { ReactElement } from 'react';
import Image from 'next/image';
import { alertBlueIcon } from '@/components/foundation/Icons';

interface LoginErrorTemplateProps extends IComponent {
  label: string;
  body: ReactElement;
  bottomNote: string;
  contactUs: string;
}

export const LoginErrorTemplate = ({
  label,
  body,
  bottomNote,
  contactUs,
}: LoginErrorTemplateProps) => {
  return (
    <div id="mainSection">
      <Column className="items-center">
        <Spacer size={32} />
        <Image className="size-[80px]" src={alertBlueIcon} alt="alert" />
        <Spacer size={16} />
        <Header className="title-2" text={label} />
        <Spacer size={16} />
        {body}
        <Row>
          <p className="text-center">
            {bottomNote} <a className="link">{contactUs}</a>
          </p>
        </Row>
      </Column>
    </div>
  );
};
