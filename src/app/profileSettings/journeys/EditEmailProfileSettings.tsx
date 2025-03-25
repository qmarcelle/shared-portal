import { ChangeAuthDeviceSlide } from '@/components/composite/ChangeAuthDeviceSlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import { AppLink } from '@/components/foundation/AppLink';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { isValidEmailAddress } from '@/utils/inputValidator';
import { useEffect, useRef, useState } from 'react';

interface EditEmailSettingsJourneyProps {
  email: string;
}

export const EditEmailProfileSettings = ({
  changePage,
  pageIndex,
  email,
}: ModalChildProps & EditEmailSettingsJourneyProps) => {
  const { dismissModal } = useAppModalStore();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const [mainAuthDevice, setMainAuthDevice] = useState(email);
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  useEffect(() => {
    // Focus the appropriate input field based on the current page
    if (pageIndex === 0 && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (pageIndex === 1 && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [pageIndex]);

  const validateEmail = (value: string) => {
    setNewAuthDevice(value);
    if (value && !isValidEmailAddress(value)) {
      setEmailErrors(['Please enter a valid email address']);
    } else {
      setEmailErrors([]);
    }
  };

  const initNewDevice = async () => {
    // Do API call for new device
    setMainAuthDevice(newAuthDevice);
    changePage?.(1, true);
  };

  const submitCode = async () => {
    // Do API call for submit code
    changePage?.(2, false);
  };

  const pages = [
    <ChangeAuthDeviceSlide
      key={0}
      label="Update Email Address"
      subLabel="Enter the new email address you'd like to use for communications and security settings."
      actionArea={
        <Column>
          <TextField
            valueCallback={validateEmail}
            label="Email Address"
            inputRef={emailInputRef}
            value={newAuthDevice}
            errors={emailErrors}
            ariaLabel="Enter your new email address"
            type="email"
            inputMode="email"
            required={true}
          />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        newAuthDevice.length > 5 && emailErrors.length === 0
          ? () => initNewDevice()
          : undefined
      }
    />,
    <InputModalSlide
      key={1}
      label="Confirm Email Address"
      subLabel="We just need to verify your email. Enter the security code we sent to:"
      actionArea={
        <Column>
          <Spacer size={16} />
          <TextBox className="font-bold text-center" text={mainAuthDevice} />
          <Spacer size={32} />
          <TextField
            type="text"
            valueCallback={(val) => setConfirmCode(val)}
            label="Enter Security Code"
            inputRef={codeInputRef}
            value={confirmCode}
            ariaLabel="Enter the security code sent to your email"
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
            required={true}
            ariaDescribedBy="email-code-description"
          />
          <div id="email-code-description" className="sr-only">
            Enter the 6-digit verification code we sent to your email
          </div>
          <Spacer size={16} />
          <AppLink
            className="self-start !p-0"
            label="Resend Code"
            aria-label="Resend verification code to your email"
          />
          <Spacer size={32} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={confirmCode.length > 5 ? () => submitCode() : undefined}
    />,
    <SuccessSlide
      key={2}
      label="Email Address Updated"
      body={
        <Column>
          <TextBox className="text-center" text="Your email address is: " />
          <Spacer size={16} />
          <TextBox className="text-center font-bold" text={mainAuthDevice} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
