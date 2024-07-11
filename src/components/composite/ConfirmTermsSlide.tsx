import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { Button } from '../foundation/Button';
import { Checkbox } from '../foundation/Checkbox';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ConfirmTermsSlideProps extends IComponent {
  label: string;
  subLabel: string;
  linkLabel: string;
  checkboxLabel: string;
  buttonLabel?: string;
  nextCallback: () => any;
  cancelCallback: () => any;
}

export const ConfirmTermsSlide = ({
  label,
  subLabel,
  linkLabel,
  checkboxLabel,
  buttonLabel = 'Next',
  nextCallback,
  cancelCallback,
}: ConfirmTermsSlideProps) => {
  return (
    <Column className="items-center">
      <Spacer size={32} />
      <Header type="title-2" text={label} />
      <Spacer size={16} />
      <TextBox text={subLabel} />
      <Spacer size={32} />
      <Checkbox label={checkboxLabel} checkProps="self-baseline ml-12 mt-1" />
      <Column className="items-center  w-[358px]">
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
          label={linkLabel}
          callback={() => {
            cancelCallback();
          }}
        />
      </Column>
    </Column>
  );
};
