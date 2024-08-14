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
  /* const [mainAuthDevice, setMainAuthDevice] = useState(initNumber);
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmCode, setConfirmCode] = useState(''); */

  /* const initNewDevice = async () => {
    // Do API call for new device
    setMainAuthDevice(newAuthDevice);
    changePage?.(1, true);
  };

  const submitCode = async () => {
    // Do API call for submit code
    changePage?.(3, false);
  }; */

  const pages = [
    <InputModalSlide
      key={0}
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
            <Radio label="Text a code to (123) 456-0000" selected={true} />
            <Radio
              label="Call with a code to (123) 456-0000"
              selected={false}
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
          <TextField label="Enter Security Code" />
          <AppLink className="self-start" label="Resend Code" />
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
          <TextBox className="font-bold" text={initNumber} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
