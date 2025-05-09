import { ReactElement } from 'react';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { Spacer } from '../foundation/Spacer';

interface SuccessSlideProps {
  label: string;
  body: ReactElement;
  btnLabel?: string;
  // TODO: Find the correct model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doneCallBack: () => any;
}

export const SuccessSlide = ({
  label,
  body,
  btnLabel = 'Done',
  doneCallBack,
}: SuccessSlideProps) => {
  return (
    <Column className="items-center">
      <img src="/assets/success.svg" className="size-[80px]" alt="success" />
      <Spacer size={24} />
      <Header className="title-2" text={label} />
      <Spacer size={16} />
      <Column className="w-[358px]">
        {body}
        <Spacer size={32} />
        <Button label={btnLabel} callback={doneCallBack} />
      </Column>
    </Column>
  );
};
