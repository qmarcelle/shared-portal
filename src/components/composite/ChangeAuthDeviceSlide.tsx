import { AnalyticsData } from '@/models/app/analyticsData';
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
  const changeDeviceAnalytics = (actionVal: string, labelVal: string) => {
    const analytics: AnalyticsData = {
      click_text: actionVal,
      click_url: undefined,
      element_category: labelVal?.toLocaleLowerCase(),
      action: actionVal,
      event: 'select_content',
      content_type: 'select',
    };
    googleAnalytics(analytics);
  };

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
            changeDeviceAnalytics('next', label);
          }}
          label="Next"
        />
        <Spacer size={16} />
        <Button
          callback={() => {
            cancelCallback?.();
            changeDeviceAnalytics('cancel', label);
          }}
          type="ghost"
          label="Cancel"
        />
      </Column>
    </Column>
  );
};
