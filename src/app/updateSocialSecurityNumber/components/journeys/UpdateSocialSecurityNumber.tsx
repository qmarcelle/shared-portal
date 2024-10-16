import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { useState } from 'react';

interface UpdateSocialSecurityNumberJourneyProps {
  memberName: string;
}
const headerText = 'Update or Add a Social Security Number';

export const UpdateSocialSecurityNumberJourney = ({
  changePage,
  pageIndex,
  memberName,
}: ModalChildProps & UpdateSocialSecurityNumberJourneyProps) => {
  const { dismissModal } = useAppModalStore();
  const [securityNumber, setSecurityNumber] = useState('***-**-****');

  const addSecurityNumber = (value: string) => {
    setSecurityNumber(value);
  };

  function changePageIndex(index: number, showback = true) {
    changePage?.(index, showback);
  }
  const submitCode = async () => {
    // Do API call for submit code
    try {
      changePageIndex?.(1, false);
    } catch (errorMessage: unknown) {
      changePageIndex?.(2, false);
    }
  };

  const pages = [
    <InputModalSlide
      key={0}
      label={headerText}
      subLabel="Enter the social security number for:"
      actionArea={
        <Column>
          <TextBox className="font-bold text-center" text={memberName} />
          <Spacer size={32} />
          <TextField
            value={securityNumber}
            valueCallback={(val) => addSecurityNumber(val)}
            maxLength={11}
            label="Social Security Number"
          />

          <Spacer size={32} />
        </Column>
      }
      nextCallback={securityNumber.length > 5 ? () => submitCode() : undefined}
      cancelCallback={() => dismissModal()}
      buttonLabel="Save Changes"
    />,

    <SuccessSlide
      key={1}
      label="Social Security Number Updated"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Your social security number has been successfully updated."
          />
          <Spacer size={32} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
    <ErrorDisplaySlide
      key={2}
      label="Try Again Later"
      body={
        <Column className="items-center">
          <TextBox
            text={
              // eslint-disable-next-line quotes
              "Oops! We're sorry. Something went wrong. Please try again."
            }
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
