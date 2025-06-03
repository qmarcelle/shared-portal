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
import { updateSSNData } from '../../actions/updateSSNData';
import { UpdateSSNRequest } from '../../models/app/updateSSNRequest';

interface UpdateSocialSecurityNumberJourneyProps {
  memberName: string;
  successCallback: () => void;
  disableSubmit?: boolean; // Renamed prop
}
const headerText = 'Update or Add a Social Security Number';

export const UpdateSocialSecurityNumberJourney = ({
  changePage,
  pageIndex,
  memberName,
  successCallback,
  disableSubmit = false, // Updated prop name
}: ModalChildProps & UpdateSocialSecurityNumberJourneyProps) => {
  const { dismissModal } = useAppModalStore();
  const [securityNumber, setSecurityNumber] = useState('***-**-****');

  const addSecurityNumber = (value: string) => {
    if (!isNaN(Number(value))) {
      setSecurityNumber(value);
    }
  };

  function changePageIndex(index: number, showback = true) {
    changePage?.(index, showback);
  }

  const submitSSNCode = async () => {
    if (disableSubmit) {
      return;
    }

    try {
      const request: UpdateSSNRequest = {
        ssn: securityNumber,
      };
      const response = await updateSSNData(request);
      if (response.data?.message === 'Updated SSN') {
        successCallback();
        changePageIndex?.(1, false);
      }
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
            hint="***-**-****"
            valueCallback={(val) => addSecurityNumber(val)}
            maxLength={9}
            label="Social Security Number"
          />

          <Spacer size={32} />
        </Column>
      }
      nextCallback={
        securityNumber.length > 5 ? () => submitSSNCode() : undefined
      }
      cancelCallback={() => dismissModal()}
      buttonLabel="Save Changes"
      disableSubmit={disableSubmit}
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
      label="Something went wrong."
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text={
              'We’re unable to update your information at this time. Please try again later.'
            }
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
