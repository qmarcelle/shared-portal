import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { modalAlertIcon, successIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import { ReactElement } from 'react';

interface EmailSuccessFailureProps extends IComponent {
  label: string;
  body: ReactElement;
  isSuccess: boolean;
}

export const EmailSuccessFailure = ({
  label,
  body,
  isSuccess,
}: EmailSuccessFailureProps) => {
  return (
    <Column className="items-center">
      <Image
        className="size-[80px]"
        src={isSuccess ? successIcon : modalAlertIcon}
        alt=""
      />
      <Spacer size={24} />
      <Header className="title-2" text={label} />
      <Spacer size={16} />
      <Column>
        {body}
        <Spacer size={32} />
      </Column>
    </Column>
  );
};
