import { ReactElement } from 'react';
import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface InitModalSlideProps extends IComponent {
  label: string;
  subLabel: ReactElement;
  buttonLabel?: string;
  actionArea?: string;
  bottomNote?: ReactElement;
  nextCallback: () => any;
  cancelCallback: () => any;
  disableSubmit?: boolean;
  changeAuthButton?: ReactElement;
}

export const InitModalSlide = ({
  label,
  subLabel,
  buttonLabel = 'Send Code',
  actionArea,
  changeAuthButton,
  bottomNote,
  nextCallback,
  cancelCallback,
  disableSubmit = false,
}: InitModalSlideProps) => {
  return (
    <Column className="items-center">
      <Spacer size={32} />
      <Header type="title-2" text={label} />
      <Spacer size={16} />
      <Column className="items-center  w-[358px]">
        {subLabel}
        {actionArea && (
          <div className="mb-4">
            <TextBox className="body-1 center font-bold" text={actionArea} />
          </div>
        )}
        {changeAuthButton && <div className="mb-4">{changeAuthButton}</div>}
        <Spacer size={32} />
        {bottomNote && <div className="mb-8">{bottomNote}</div>}
        <Button
          className="font-bold primary-color"
          label={buttonLabel}
          type="primary"
          callback={() => {
            nextCallback();
          }}
          disable={disableSubmit}
        ></Button>
        <Spacer size={16} />
        <AppLink
          label="Cancel"
          linkUnderline="!no-underline"
          type="button"
          callback={() => {
            cancelCallback();
          }}
        />
      </Column>
    </Column>
  );
};
