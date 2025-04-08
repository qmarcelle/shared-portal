import { InitModalSlide } from '@/components/composite/InitModalSlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
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
import { useEffect, useRef } from 'react';

const bottomNote =
  'By sending the code I agree to receive a one-time security code. Message and data rates may apply, Subject to terms and condition.';

/* eslint-disable */

interface InviteToRegisterProps {
  phoneNumber: string;
}

export const UpdatePhoneNumberJourney = ({
  changePage,
  pageIndex,
  phoneNumber,
}: ModalChildProps & InviteToRegisterProps) => {
  const { dismissModal } = useAppModalStore();
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const verificationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pageIndex === 0) {
      // Focus phone input on first page
      phoneInputRef.current?.focus();
    } else if (pageIndex === 2) {
      // Focus verification code input on verification page
      verificationInputRef.current?.focus();
    }
  }, [pageIndex]);

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
            ref={phoneInputRef}
            label="Phone Number"
            ariaLabel="Enter your new phone number"
            ariaDescribedBy="phone-number-description"
          />
          <TextBox
            id="phone-number-description"
            className="sr-only"
            text="Enter your new phone number in the format (XXX) XXX-XXXX"
          />
          <Spacer size={24} />
        </Column>
      }
      nextCallback={() => changePage?.(1, true)}
      cancelCallback={() => dismissModal()}
    />,
    <InitModalSlide
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
              ariaLabel="Receive verification code via text message"
            />
            <Radio
              label="Call with a code to (123) 456-0000"
              selected={false}
              ariaLabel="Receive verification code via phone call"
            />
          </Column>
        </Column>
      }
      changeAuthButton={undefined}
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
          <TextBox className="font-bold" text={phoneNumber} />
          <Spacer size={32} />
          <TextField
            ref={verificationInputRef}
            label="Enter Security Code"
            ariaLabel="Enter the verification code sent to your phone"
            ariaDescribedBy="verification-code-description"
          />
          <TextBox
            id="verification-code-description"
            className="sr-only"
            text="Enter the 6-digit verification code sent to your phone number"
          />
          <AppLink
            className="self-start"
            label="Resend Code"
            ariaLabel="Click to resend the verification code"
          />
          <Spacer size={32} />
        </Column>
      }
      nextCallback={() => changePage?.(3, true)}
      cancelCallback={() => dismissModal()}
    />,
    <SuccessSlide
      key={3}
      label="Phone Number Updated"
      body={
        <Column className="items-center">
          <TextBox className="text-center" text="Your phone number is:" />
          <Spacer size={16} />
          <TextBox className="font-bold" text={phoneNumber} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
