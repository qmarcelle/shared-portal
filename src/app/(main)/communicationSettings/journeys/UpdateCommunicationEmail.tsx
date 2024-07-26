import { ChangeAuthDeviceSlide } from '@/components/composite/ChangeAuthDeviceSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import { AppLink } from '@/components/foundation/AppLink';
import {
    ModalChildProps,
    useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { TextField } from '@/components/foundation/TextField';
import { useState } from 'react';
import { InputModalSlide } from '../../../../components/composite/InputModalSlide';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';

const headerText = 'Confirm Email Address';
interface UpdateCommunicationEmailProps {
  email: string;
}

export const UpdateCommunicationEmail = ({
  changePage,
  pageIndex,
  email,
}: ModalChildProps & UpdateCommunicationEmailProps) => {
  const { dismissModal } = useAppModalStore();
  /* const initChange = () => {
    changePage!(1, true);
  };
  function changePageIndex(index: number, showback = true) {
    changePage?.(index, showback);
  } */
  const [mainAuthDevice, setMainAuthDevice] = useState(email);
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmCode, setConfirmCode] = useState('');

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
          valueCallback={(val) => setNewAuthDevice(val)}
          label="Email Address"
        />
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        newAuthDevice.length > 5 ? () => initNewDevice() : undefined
      }
    />,
    <InputModalSlide
      key={1}
      label={headerText}
      subLabel="We just need to verify your email. Enter the security code we sent to:"
      actionArea={
        <Column>
          <TextBox
            className="body-1 text-center font-bold"
            text={mainAuthDevice}
          />
          <Spacer size={32} />
          <TextField
            type="text"
            valueCallback={(val) => setConfirmCode(val)}
            label="Enter Security Code"
          ></TextField>
          <Spacer size={16} />
          <AppLink className="self-start" label="Resend Code" />
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
        <Column className="items-center">
          <TextBox className="text-center" text="Your email address is:" />
          <Spacer size={16} />
          <TextBox text={mainAuthDevice} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
