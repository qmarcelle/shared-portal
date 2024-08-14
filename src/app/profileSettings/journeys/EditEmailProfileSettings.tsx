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
import { useState } from 'react';

interface EditEmailSettingsJourneyProps {
  email: string;
}

export const EditEmailProfileSettings = ({
  changePage,
  pageIndex,
  email,
}: ModalChildProps & EditEmailSettingsJourneyProps) => {
  const { dismissModal } = useAppModalStore();
  /* 
  const initChange = () => {
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
          />
          <Spacer size={16} />
          <AppLink className="self-start !p-0" label="Resend Code" />
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
