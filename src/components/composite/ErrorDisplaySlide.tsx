import { ReactElement } from 'react';
import { IComponent } from '../IComponent';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { Spacer } from '../foundation/Spacer';

interface ErrorDisplaySlideProps extends IComponent {
  label: string;
  body: ReactElement;
  // TODO: Find the correct model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doneCallBack: () => any;
}

export const ErrorDisplaySlide = ({
  label,
  body,
  doneCallBack,
}: ErrorDisplaySlideProps) => {
  return (
    <Column className="items-center">
      <Image className="size-[80px]" src={modalAlertIcon} alt="" />
      <Spacer size={24} />
      <Header className="title-2" text={label} />
      <Spacer size={16} />
      <Column className="w-[358px]">
        {body}
        <Spacer size={32} />
        <Button label="Done" callback={doneCallBack} />
      </Column>
    </Column>
  );
};
