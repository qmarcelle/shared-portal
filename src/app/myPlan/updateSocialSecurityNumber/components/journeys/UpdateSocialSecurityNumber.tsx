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
  const [securityNumber, setSecurityNumber] = useState('***-**-****');
  const [inputError, setInputError] = useState<string[] | null>(null);
  const ssnInputRef = useRef<HTMLInputElement>(null);

  // Focus SSN input when modal loads
  useEffect(() => {
    if (pageIndex === 0 && ssnInputRef.current) {
      setTimeout(() => ssnInputRef.current?.focus(), 100);
    }
  }, [pageIndex]);

  const addSecurityNumber = (value: string) => {
    // Clear any previous errors
    setInputError(null);

    // Only accept numeric input
    if (value === '' || !isNaN(Number(value.replace(/\D/g, '')))) {
      const digitsOnly = value.replace(/\D/g, '');

      // Format the SSN with dashes for better screen reader experience
      if (digitsOnly.length <= 9) {
        let formattedSSN = digitsOnly;
        if (digitsOnly.length > 3) {
          formattedSSN = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
        }
        if (digitsOnly.length > 5) {
          formattedSSN = `${formattedSSN.slice(0, 6)}-${formattedSSN.slice(6)}`;
        }
        setSecurityNumber(formattedSSN);
      }
    } else {
      setInputError(['Please enter numbers only']);
    }
  };

  function changePageIndex(index: number, showback = true) {
    changePage?.(index, showback);
  }

  const submitSSNCode = async () => {
    try {
      // Remove any non-numeric characters before submitting
      const cleanSSN = securityNumber.replace(/\D/g, '');

      if (cleanSSN.length !== 9) {
        setInputError(['SSN must be 9 digits']);
        return;
      }

      const request: UpdateSSNRequest = {
        ssn: cleanSSN,
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
            aria-live="polite"
          />
          <Spacer size={32} />
          <TextField
            hint="123-45-6789"
            valueCallback={(val) => addSecurityNumber(val)}
            value={securityNumber}
            maxLength={11}
            label="Social Security Number"
            inputRef={ssnInputRef}
            errors={inputError}
            aria-label="Enter social security number, format: 9 digits"
            aria-required="true"
            aria-describedby="ssn-description"
          />
          <div id="ssn-description" className="sr-only">
            Enter your 9-digit Social Security Number. The format is 3 digits, 2
            digits, 4 digits.
          </div>
          <Spacer size={32} />
        </Column>
      }
      nextCallback={
        securityNumber.length >= 9 &&
        securityNumber !== '***-**-****' &&
        !inputError
          ? () => submitSSNCode()
          : undefined
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
            aria-live="assertive"
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
            aria-live="assertive"
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
