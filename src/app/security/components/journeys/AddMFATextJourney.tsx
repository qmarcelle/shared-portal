import { ChangeAuthDeviceSlide } from '@/components/composite/ChangeAuthDeviceSlide';
import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InitModalSlide } from '@/components/composite/InitModalSlide';
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
import { AppProg } from '@/models/app_prog';
import { ComponentDetails } from '@/models/component_details';
import { formatPhoneNumber, isValidMobileNumber } from '@/utils/inputValidator';
import { useEffect, useState } from 'react';
import { MfaDeviceType } from '../../models/mfa_device_type';
import { VerifyMfaResponse } from '../../models/verify_mfa_devices';
import { useSecuritySettingsStore } from '../../stores/security_settings_store';

const bottomNote =
  'By sending the code I agree to receive a one-time security code. Message and data rates may apply, Subject to terms and confictions.';
const headerText = 'Text Message Setup';

interface AddMfaTextJourneyProps {
  initNumber: string;
}

export const AddMFATextJourney = ({
  changePage,
  pageIndex,
  initNumber,
}: ModalChildProps & AddMfaTextJourneyProps) => {
  const {
    updateMfaDevice,
    verifyMfaDevice,
    verifyMfaResult,
    resetState,
    invalidErrors,
    updateInvalidError,
  } = useSecuritySettingsStore();
  const [mainAuthDevice, setMainAuthDevice] = useState(initNumber);
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const { dismissModal } = useAppModalStore();

  useEffect(() => {
    updateInvalidError([]);
  }, [updateInvalidError]);

  function changePageIndex(index: number, showback = true) {
    changePage?.(index, showback);
    resetState();
  }

  const initNewDevice = async () => {
    // Do API call for new device
    try {
      await updateMfaDevice(MfaDeviceType.text, newAuthDevice);
      setMainAuthDevice(newAuthDevice);
      changePageIndex?.(1, true);
    } catch (errorMessage: unknown) {
      changePageIndex?.(4, true);
    }
  };

  const submitCode = async () => {
    // Do API call for submit code
    try {
      const response: ComponentDetails<VerifyMfaResponse> | undefined =
        await verifyMfaDevice(
          MfaDeviceType.text,
          confirmCode,
          newAuthDevice && newAuthDevice != '' ? newAuthDevice : mainAuthDevice,
        );
      if (response?.state == AppProg.success) {
        changePageIndex?.(3, false);
      }
    } catch (errorMessage: unknown) {
      changePageIndex?.(4, true);
    }
  };
  const validatePhoneNumber = (phoneNumber: string) => {
    const value = formatPhoneNumber(phoneNumber);
    setNewAuthDevice(value);
    if (!isValidMobileNumber(value)) {
      updateInvalidError(['Invalid Phone Number']);
    } else {
      updateInvalidError([]);
    }
  };
  const pages = [
    <InitModalSlide
      key={0}
      label="Text Message Setup"
      subLabel={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Continue with your current phone number or change it."
          />
          <TextBox text="Your phone number is:" />
        </Column>
      }
      actionArea={mainAuthDevice}
      changeAuthButton={
        <AppLink
          label="Change Your Number"
          callback={() => changePageIndex?.(2, true)}
        />
      }
      bottomNote={<TextBox text={bottomNote} />}
      nextCallback={() => changePageIndex?.(1, true)}
      cancelCallback={() => dismissModal()}
    />, // MfaInit
    <InputModalSlide
      key={1}
      label={headerText}
      subLabel="Enter the security code sent to you phone number to complete text message setup. We've sent a code to:"
      actionArea={
        <Column className="items-center">
          <TextBox className="font-bold" text={mainAuthDevice} />
          <Spacer size={32} />
          <TextField
            valueCallback={(val) => setConfirmCode(val)}
            label="Enter Security Code"
            errors={verifyMfaResult?.errors}
          />
          <AppLink
            className="self-start"
            callback={initNewDevice}
            label="Resend Code"
          />
          <Spacer size={32} />
        </Column>
      }
      nextCallback={confirmCode.length > 5 ? () => submitCode() : undefined}
      cancelCallback={() => dismissModal()}
    />, // MfaEntry
    <ChangeAuthDeviceSlide
      key={2}
      label="Change Phone Number"
      subLabel="Enter the new phone number you'd like to use for Communications and Security Settings"
      bottomNote="By sending the code I agree to receive a one-time security code. Message and data rates may apply, Subject to terms and confictions."
      actionArea={
        <TextField
          valueCallback={(val) => validatePhoneNumber(val)}
          label="Phone Number"
          value={newAuthDevice}
          errors={invalidErrors}
        />
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        isValidMobileNumber(newAuthDevice) ? () => initNewDevice() : undefined
      }
    />,
    <SuccessSlide
      key={3}
      label="Text Message Setup is Complete"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="The next time you login, you'll receive a text message with a security code to:"
          />
          <Spacer size={16} />
          <TextBox text={mainAuthDevice} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
    <ErrorDisplaySlide
      key={4}
      label="Try Again Later"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text={
              // eslint-disable-next-line quotes
              "Oops! We're sorry. Something went wrong. Please try again."
            }
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
