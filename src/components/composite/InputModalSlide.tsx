import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import { ReactElement } from 'react';
import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

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

export const InputModalSlide = ({
  label,
  subLabel,
  buttonLabel = 'Confirm',
  actionArea,
  nextCallback,
  cancelCallback,
}: InputModalSlideProps) => {
  const inputModalAnalytics = (buttonLabelVal: string, labelVal: string) => {
    const analytics: AnalyticsData = {
      click_text: buttonLabelVal?.toLocaleLowerCase(),
      click_url: undefined,
      element_category: labelVal?.toLocaleLowerCase(),
      action: buttonLabelVal?.toLocaleLowerCase(),
      event: 'select_content',
      content_type: 'select',
    };
    googleAnalytics(analytics);
  };
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
          callback={
            nextCallback
              ? () => {
                  nextCallback();
                  inputModalAnalytics(buttonLabel, label);
                }
              : undefined
          }
        ></Button>
        <Spacer size={24} />
      </Column>
      <AppLink
        label="Cancel"
        callback={
          cancelCallback
            ? () => {
                cancelCallback();
                inputModalAnalytics('cancel', label);
              }
            : undefined
        }
      />
    </Column>
  );
};
