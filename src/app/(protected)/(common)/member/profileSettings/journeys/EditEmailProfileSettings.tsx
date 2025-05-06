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
  const verificationInputRef = useRef<HTMLInputElement>(null);

  const [mainAuthDevice, setMainAuthDevice] = useState(email);
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmCode, setConfirmCode] = useState('');

  useEffect(() => {
    if (pageIndex === 0) {
      // Focus email input on first page
      emailInputRef.current?.focus();
    } else if (pageIndex === 1) {
      // Focus verification code input on verification page
      verificationInputRef.current?.focus();
    }
  }, [pageIndex]);

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
        <TextField
          ref={emailInputRef}
          valueCallback={(val) => setNewAuthDevice(val)}
          label="Email Address"
          ariaLabel="Enter your new email address"
          ariaDescribedBy="email-description"
          type="email"
        />
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        newAuthDevice.length > 5 ? () => initNewDevice() : undefined
      }
    />,
    <InputModalSlide
      key={1}
      label="Confirm Email Address"
      subLabel="We just need to verify your email. Enter the security code we sent to:"
      actionArea={
        <Column>
          <Spacer size={16} />
          <TextBox
            className="font-bold text-center"
            text={mainAuthDevice}
            ariaLabel="Your email address"
          />
          <Spacer size={32} />
          <TextField
            ref={verificationInputRef}
            type="text"
            valueCallback={(val) => setConfirmCode(val)}
            label="Enter Security Code"
            ariaLabel="Enter the verification code sent to your email"
            ariaDescribedBy="verification-code-description"
          />
          <TextBox
            id="verification-code-description"
            className="sr-only"
            text="Enter the 6-digit verification code sent to your email address"
          />
          <Spacer size={16} />
          <AppLink
            className="self-start !p-0"
            label="Resend Code"
            ariaLabel="Click to resend the verification code"
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
          <TextBox
            className="text-center"
            text="Your email address is: "
            ariaLabel="Your updated email address is"
          />
          <Spacer size={16} />
          <TextBox
            className="text-center font-bold"
            text={mainAuthDevice}
            ariaLabel={mainAuthDevice}
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
