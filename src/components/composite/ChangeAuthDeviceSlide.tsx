import { googleAnalytics } from '@/utils/analytics';
import { ReactElement } from 'react';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ChangeAuthDeviceProps {
  label: string;
  subLabel: string;
  actionArea: ReactElement;
  bottomNote?: string;
  nextCallback: (() => any) | undefined;
  cancelCallback: () => any;
}

export const ChangeAuthDeviceSlide = ({
  label,
  subLabel,
  actionArea,
  bottomNote,
  nextCallback,
  cancelCallback,
}: ChangeAuthDeviceProps) => {
  return (
    <Column className="items-center">
      <Header className="title-2" text={label} />
      <Spacer size={16} />
      <TextBox className="text-center" text={subLabel} />
      <Spacer size={32} />
      <Column className="w-[352px]">
        {actionArea}
        <Spacer size={24} />
        {bottomNote && <TextBox className="mb-8" text={bottomNote} />}
        <Button
          callback={() => {
            nextCallback?.();
            googleAnalytics(
              'next',
              undefined,
              label,
              'next',
              'select_content',
              'select',
            );
          }}
          label="Next"
        />
        <Spacer size={16} />
        <Button
          callback={() => {
            cancelCallback?.();
            googleAnalytics(
              'cancel',
              undefined,
              label,
              'cancel',
              'select_content',
              'select',
            );
          }}
          type="ghost"
          label="Cancel"
        />
      </Column>
    </Column>
  );
};
