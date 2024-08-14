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
  const {dismissModal} = useAppModalStore();
  const pages = [
    <InputModalSlide
      label="Update Phone Number"
      subLabel="Enter the new phone number you'd like to use for communications and security settings."
      buttonLabel="Next"
      actionArea={
        <Column className="items-center">
          <Spacer size={32} />
          <TextField label="Phone Number" />
          <Spacer size={24} />
        </Column>
      }
      nextCallback={() => changePage?.(1, true)}
      cancelCallback={() => dismissModal()}
    />,
    <InitModalSlide
      label="Confirm Phone Number"
      subLabel={
        <Column>
          <TextBox
            className="text-center"
            text="We just need to verify your phone number. How would you like to receive the security code?"
          />
          <Spacer size={24} />
          <Column>
            <Radio label="Text a code to (123) 456-0000" selected={true} />
            <Radio
              label="Call with a code to (123) 456-0000"
              selected={false}
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
      label="Confirm Phone Number"
      subLabel="Enter the security code we sent to:"
      actionArea={
        <Column className="items-center">
          <TextBox className="font-bold" text={phoneNumber} />
          <Spacer size={32} />
          <TextField label="Enter Security Code" />
          <AppLink className="self-start" label="Resend Code" />
          <Spacer size={32} />
        </Column>
      }
      nextCallback={() => changePage?.(3, true)}
      cancelCallback={() => dismissModal()}
    />,
    <SuccessSlide
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
