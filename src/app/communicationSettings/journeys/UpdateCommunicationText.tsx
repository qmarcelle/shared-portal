import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SelectModalSlide } from '@/components/composite/SelectModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import { AppLink } from '@/components/foundation/AppLink';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { formatPhoneNumber, isValidMobileNumber } from '@/utils/inputValidator';
import { useEffect, useRef, useState } from 'react';

const bottomNote =
  'By sending the code I agree to receive a one-time security code. Message and data rates may apply, Subject to terms and confictions.';
//const headerText = 'Confirm Phone Number';

interface UpdateCommunicationTextProps {
  initNumber: string;
}

export const UpdateCommunicationText = ({
  changePage,
  pageIndex,
  initNumber,
}: ModalChildProps & UpdateCommunicationTextProps) => {
  const { dismissModal } = useAppModalStore();
  const [mainAuthDevice, setMainAuthDevice] = useState(initNumber);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneErrors, setPhoneErrors] = useState<string[]>([]);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus management for different steps
    if (pageIndex === 0 && phoneInputRef.current) {
      phoneInputRef.current.focus();
    } else if (pageIndex === 2 && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [pageIndex]);

  const validatePhoneNumber = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setNewPhoneNumber(formatted);

    if (value && !isValidMobileNumber(value.replace(/\D/g, ''))) {
      setPhoneErrors(['Please enter a valid phone number']);
    } else {
      setPhoneErrors([]);
    }
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Update Phone Number"
      subLabel="Enter the new phone number you'd like to use for communications and security settings."
      buttonLabel="Next"
      actionArea={
        <Column className="items-center">
          <Spacer size={32} />
          <TextField
            label="Phone Number"
            inputRef={phoneInputRef}
            valueCallback={validatePhoneNumber}
            value={newPhoneNumber}
            errors={phoneErrors}
            ariaLabel="Enter your new phone number"
            required={true}
            type="tel"
            inputMode="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          />
          <Spacer size={24} />
        </Column>
      }
      nextCallback={
        newPhoneNumber && phoneErrors.length === 0
          ? () => changePage?.(1, true)
          : undefined
      }
      cancelCallback={() => dismissModal()}
    />,
    <SelectModalSlide
      key={1}
      label="Confirm Phone Number"
      subLabel={
        <Column>
          <TextBox
            className="text-center"
            text="We just need to verify your phone number. How would you like to receive the security code?"
          />
          <Spacer size={24} />
          <Column>
            <Radio
              label="Text a code to (123) 456-0000"
              selected={true}
              ariaLabel="Send security code via text message"
            />
            <Radio
              label="Call with a code to (123) 456-0000"
              selected={false}
              ariaLabel="Send security code via phone call"
            />
          </Column>
        </Column>
      }
      bottomNote={<TextBox className="body-2" text={bottomNote} />}
      buttonLabel="Send Code"
      nextCallback={() => changePage?.(2, true)}
      cancelCallback={() => dismissModal()}
    />,
    <InputModalSlide
      key={2}
      label="Confirm Phone Number"
      subLabel="Enter the security code we sent to:"
      actionArea={
        <Column className="items-center">
          <TextBox className="font-bold" text={initNumber} />
          <Spacer size={32} />
          <TextField
            label="Enter Security Code"
            inputRef={codeInputRef}
            valueCallback={(val) => setVerificationCode(val)}
            value={verificationCode}
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
            ariaLabel="Enter the 6-digit security code"
            ariaDescribedBy="code-description"
            required={true}
          />
          <div id="code-description" className="sr-only">
            Enter the 6-digit code we sent to your phone number
          </div>
          <AppLink
            className="self-start"
            label="Resend Code"
            aria-label="Resend security code"
          />
          <Spacer size={32} />
        </Column>
      }
      nextCallback={
        verificationCode.length === 6 ? () => changePage?.(3, true) : undefined
      }
      cancelCallback={() => dismissModal()}
    />,
    <SuccessSlide
      key={3}
      label="Phone Number Updated"
      body={
        <Column className="items-center">
          <TextBox className="text-center" text="Your phone number is:" />
          <Spacer size={16} />
          <TextBox className="font-bold" text={initNumber} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
