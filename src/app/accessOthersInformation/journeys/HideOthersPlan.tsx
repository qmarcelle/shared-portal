import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { capitalizeName } from '@/utils/capitalizeName';
import { useEffect, useState } from 'react';

interface HideOthersPlanProps {}

export const HideOthersPlan = ({
  changePage,
  pageIndex,
}: ModalChildProps & HideOthersPlanProps) => {
  const { dismissModal } = useAppModalStore();

  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {}, [pageIndex]);

  const initNewDevice = async () => {
    try {
      changePage?.(1, true); // Change to page 1 on successful validation
      setNextDisabled(true);
    } catch (errorMessage: unknown) {
      console.error('Error updating the phone', errorMessage);
      setNextDisabled(true);
    }
  };
  const getNextCallback = (
    initNewDevice: () => void,
  ): (() => void) | undefined => {
    return () => initNewDevice();
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Hide Plan"
      subLabel="Do you want to hide this plan?"
      buttonLabel="Yes, hide this plan."
      actionArea={
        <Column className="items-center">
          <Spacer size={32} />

          <TextBox
            className="font-bold body-1 "
            text={capitalizeName('Ellie Williams')}
          />
          <TextBox text={'Subscriber: ' + 'Ellie Williams'} />
          <TextBox text={'ID: ' + 'ABC1234555555'} />
          <TextBox text={'Policies: ' + 'Dental'} />
          <Spacer size={32} />
          <TextBox
            text={
              'If the plan is hidden, it will not display as an option in the Plan Selection for this member. '
            }
          />
          <Spacer size={32} />
        </Column>
      }
      nextCallback={nextDisabled ? undefined : getNextCallback(initNewDevice)}
      cancelCallback={() => dismissModal()}
    />,

    <SuccessSlide
      key={3}
      label="Plan is Now Hidden"
      body={
        <Column className="items-center">
          <Spacer size={16} />
          <TextBox text="You can unhide this plan at anytime." />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
