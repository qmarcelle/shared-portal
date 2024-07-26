import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ReactElement } from 'react';

interface InputModalSlideProps extends IComponent {
  label: string;
  subLabel: string;
  buttonLabel?: string;
  actionArea: ReactElement;
  bottomNote?: string;
  // TODO: Find the correct model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nextCallback: (() => any) | undefined;
  // TODO: Find the correct model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelCallback: () => any;
}

export const ThirdPartySharingInputslide = ({
  label,
  subLabel,
  buttonLabel = 'Confirm',
  actionArea,
  nextCallback,
  cancelCallback,
}: InputModalSlideProps) => {
  return (
    <Column className="items-center">
      <Spacer size={32} />
      <Header type="title-2" text={label} />
      <Spacer size={16} />
      <TextBox className="body-1 text-center" text={subLabel} />
      <Column className="w-[358px]">
        <Spacer size={16} />
        {actionArea}
        <Button
          className="font-bold active"
          label={buttonLabel}
          type="primary"
          callback={nextCallback}
        ></Button>
        <Spacer size={24} />
      </Column>
      <AppLink label="Cancel" callback={cancelCallback} />
    </Column>
  );
};
