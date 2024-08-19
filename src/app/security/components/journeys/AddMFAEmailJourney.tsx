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
import { isValidEmailAddress, validateLength } from '@/utils/inputValidator';
import { useEffect, useState } from 'react';
import { MfaDeviceType } from '../../models/mfa_device_type';
import { VerifyMfaResponse } from '../../models/verify_mfa_devices';
import { useSecuritySettingsStore } from '../../stores/security_settings_store';

const headerText = 'Email Setup';

interface AddMfaEmailJourneyProps {
  email: string;
}

export const AddMFAEmailJourney = ({
  changePage,
  pageIndex,
  email,
}: ModalChildProps & AddMfaEmailJourneyProps) => {
  const {
    updateMfaDevice,
    verifyMfaDevice,
    resetState,
    verifyMfaResult,
    invalidErrors,
    updateInvalidError,
    resetVerifyMfaError,
  } = useSecuritySettingsStore();
  const { dismissModal } = useAppModalStore();
  /* const initChange = () => {
    changePage!(1, true);
  }; */
  function changePageIndex(index: number, showback = true) {
    changePage?.(index, showback);
    resetState();
  }
  const [mainAuthDevice, setMainAuthDevice] = useState(email);
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [resentCode, setResentCode] = useState(false);
  // const [emailError, setemailError] = useState<string[]>([]);
  useEffect(() => {
    updateInvalidError([]);
  }, [updateInvalidError]);

  const initNewDevice = async (value: boolean) => {
    // Do API call for new device
    try {
      let email = '';
      if (newAuthDevice == '') {
        email = mainAuthDevice;
        setNewAuthDevice(mainAuthDevice);
      } else {
        email = newAuthDevice;
        setMainAuthDevice(newAuthDevice);
      }
      if (value) {
        setResentCode(true);
      } else {
        setResentCode(false);
      }
      await updateMfaDevice(MfaDeviceType.email, email);
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
          MfaDeviceType.email,
          confirmCode,
          newAuthDevice && newAuthDevice != '' ? newAuthDevice : mainAuthDevice,
        );
      if (response?.state == AppProg.success) {
        changePageIndex?.(2, false);
      }

      if (response?.state == AppProg.failed && resentCode) {
        throw 'error';
      }
    } catch (errorMessage: unknown) {
      changePageIndex?.(4, true);
    }
  };

  const sendCode = async () => {
    initNewDevice(false);
    changePageIndex?.(1, true);
  };

  const validateEmailAddress = (value: string) => {
    setNewAuthDevice(value);
    const isValidEmail = isValidEmailAddress(value);
    const isValidLength = validateLength(value);
    if (!isValidEmail && !isValidLength) {
      updateInvalidError(['Invalid Email Address']);
    } else if (isValidEmail && !isValidLength) {
      updateInvalidError(['Invalid Email Address']);
    } else if (!isValidEmail && isValidLength) {
      updateInvalidError(['Invalid Email Address']);
    } else {
      updateInvalidError([]);
    }
  };

  const updateSecurityCode = (value: string) => {
    setConfirmCode(value);
    if (verifyMfaResult?.errors.length) {
      resetVerifyMfaError();
    }
  };

  const pages = [
    <InitModalSlide
      key={0}
      label="Email Setup"
      subLabel={
        <Column>
          <TextBox
            className="body-1 center"
            text={'Continue with your current email or change it.'}
          />
          <TextBox className="body-1 text-center" text="Your email is:" />
        </Column>
      }
      // actionArea="chall123@gmail.com"
      actionArea={mainAuthDevice}
      changeAuthButton={
        <AppLink
          label="Change Your Email Address"
          callback={() => changePageIndex?.(3, true)}
        />
      }
      cancelCallback={() => dismissModal()}
      nextCallback={() => sendCode()}
    />,

    <InputModalSlide
      key={1}
      label={headerText}
      subLabel="Enter the security code sent to your email to complete email setup.We've sent a code to:"
      actionArea={
        <Column>
          <TextBox
            className="body-1 text-center font-bold"
            text={mainAuthDevice}
          />
          <Spacer size={32} />
          <TextField
            type="text"
            valueCallback={(val) => updateSecurityCode(val)}
            label="Enter Security Code"
            errors={verifyMfaResult?.errors}
          ></TextField>
          <Spacer size={16} />
          {resentCode && (
            <TextBox className="body-1 text-lime-700" text="Code resent!" />
          )}
          {!resentCode && (
            <AppLink
              className="self-start"
              callback={() => initNewDevice(true)}
              label="Resend Code"
            />
          )}
          <Spacer size={32} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={confirmCode.length > 5 ? () => submitCode() : undefined}
    />,

    <SuccessSlide
      key={2}
      label="Email Setup is Complete"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="The next time you login, you'll receive an email with a security code to:"
          />
          <Spacer size={16} />
          <TextBox text={mainAuthDevice} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
    <ChangeAuthDeviceSlide
      key={3}
      label="Change Email Address"
      subLabel="Enter the new email address you'd like to use for communications and security settings."
      actionArea={
        <TextField
          valueCallback={(val) => validateEmailAddress(val)}
          label="Email Address"
          type="email"
          value={newAuthDevice}
          errors={invalidErrors}
        />
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        isValidEmailAddress(newAuthDevice) && newAuthDevice.length !== 0
          ? () => initNewDevice(false)
          : undefined
      }
    />,
    <ErrorDisplaySlide
      key={4}
      label="Try Again Later"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Oops! We're sorry. Something went wrong. Please try again."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
