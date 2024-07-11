import { ReactElement } from 'react';
import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { Spacer } from '../foundation/Spacer';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface SelectModalSlideProps extends IComponent {
  label: string;
  subLabel: ReactElement;
  buttonLabel?: string;
  bottomNote?: ReactElement;
  nextCallback: () => any;
  cancelCallback: () => any;
}

export const SelectModalSlide = ({
  label,
  subLabel,
  buttonLabel = 'Send Code',
  bottomNote,
  nextCallback,
  cancelCallback,
}: SelectModalSlideProps) => {
  return (
    <Column className="items-center">
      <Spacer size={32} />
      <Header type="title-2" text={label} />
      <Spacer size={16} />
      <Column className="items-center  w-[358px]">
        {subLabel}
        <Spacer size={16} />
        {bottomNote}
        <Spacer size={32} />
        <Button
          className="font-bold primary-color"
          label={buttonLabel}
          type="primary"
          callback={() => {
            nextCallback();
          }}
        ></Button>
        <Spacer size={16} />
        <AppLink
          label="Cancel"
          callback={() => {
            cancelCallback();
          }}
        />
      </Column>
    </Column>
  );
};
