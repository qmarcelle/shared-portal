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
import { useEffect, useRef, useState } from 'react';
import { updateSSNData } from '../../actions/updateSSNData';
import { UpdateSSNRequest } from '../../models/app/updateSSNRequest';

interface UpdateSocialSecurityNumberJourneyProps {
  memberName: string;
  successCallback: () => void;
}

const headerText = 'Update or Add a Social Security Number';

export const UpdateSocialSecurityNumberJourney = ({
  changePage,
  pageIndex,
  memberName,
  successCallback,
}: ModalChildProps & UpdateSocialSecurityNumberJourneyProps) => {
  const { dismissModal } = useAppModalStore();
  const ssnInputRef = useRef<HTMLInputElement>(null);
  const [securityNumber, setSecurityNumber] = useState('***-**-****');

  useEffect(() => {
    if (pageIndex === 0) {
      // Focus SSN input on first page
      ssnInputRef.current?.focus();
    }
  }, [pageIndex]);

  const addSecurityNumber = (value: string) => {
    if (!isNaN(Number(value))) {
      setSecurityNumber(value);
    }
  };

  function changePageIndex(index: number, showback = true) {
    changePage?.(index, showback);
  }

  const submitSSNCode = async () => {
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
          <TextBox
            className="font-bold text-center"
            text={memberName}
            ariaLabel={`Enter SSN for ${memberName}`}
          />
          <Spacer size={32} />
          <TextField
            ref={ssnInputRef}
            hint="***-**-****"
            valueCallback={(val) => addSecurityNumber(val)}
            maxLength={9}
            label="Social Security Number"
            ariaLabel="Enter your social security number"
            ariaDescribedBy="ssn-description"
            type="password"
          />
          <TextBox
            id="ssn-description"
            className="sr-only"
            text="Enter your 9-digit social security number. The number will be masked for security."
          />
          <Spacer size={32} />
        </Column>
      }
      nextCallback={
        securityNumber.length > 5 ? () => submitSSNCode() : undefined
      }
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
            ariaLabel="Your social security number has been successfully updated."
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
            text="We're unable to update your information at this time. Please try again later."
            ariaLabel="We're unable to update your information at this time. Please try again later."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
