import { ChangeAuthDeviceSlide } from '@/components/composite/ChangeAuthDeviceSlide';
import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
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
import { AnalyticsData } from '@/models/app/analyticsData';
import { AppProg } from '@/models/app_prog';
import { ComponentDetails } from '@/models/component_details';
import { googleAnalytics } from '@/utils/analytics';
import { formatPhoneNumber, isValidMobileNumber } from '@/utils/inputValidator';
import { useEffect, useState } from 'react';
import { MfaDeviceType } from '../../models/mfa_device_type';
import { VerifyMfaResponse } from '../../models/verify_mfa_devices';
import { useSecuritySettingsStore } from '../../stores/security_settings_store';

/* const bottomNote =
  'By sending the code I agree to receive a one-time security code. Message and data rates may apply, Subject to terms and confictions.'; */
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
    resetVerifyMfaError,
  } = useSecuritySettingsStore();
  const [mainAuthDevice, setMainAuthDevice] = useState(initNumber);
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [resentCode, setResentCode] = useState(false);
  const { dismissModal } = useAppModalStore();
  let isBackSpacePressed: boolean = false;

  useEffect(() => {
    updateInvalidError([]);
  }, [updateInvalidError]);

  function changePageIndex(index: number, showback = true) {
    changePage?.(index, showback);
    resetState();
  }

  const addMFATextAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'resend code',
      click_url: undefined,
      element_category: 'text message setup',
      action: 'resend code',
      event: 'select_content',
      content_type: 'select',
    };
    googleAnalytics(analytics);
  };
  const initNewDevice = async (value: boolean) => {
    // Do API call for new device
    try {
      let phone = '';
      if (newAuthDevice == '') {
        phone = mainAuthDevice;
        setNewAuthDevice(mainAuthDevice);
      } else {
        phone = newAuthDevice;
        setMainAuthDevice(newAuthDevice);
      }
      if (value) {
        addMFATextAnalytics();
        setResentCode(true);
      } else {
        setResentCode(false);
      }
      await updateMfaDevice(MfaDeviceType.text, phone);
      changePageIndex?.(1, true);
    } catch (errorMessage: unknown) {
      changePageIndex?.(3, true);
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
        changePageIndex?.(2, false);
      }
      if (response?.state == AppProg.failed && resentCode) {
        throw 'error';
      }
    } catch (errorMessage: unknown) {
      changePageIndex?.(3, true);
    }
  };
  /* const sendCode = async () => {
    initNewDevice(false);
    changePageIndex?.(1, true);
  }; */
  const validatePhoneNumber = (phoneNumber: string) => {
    let value = phoneNumber;
    if (!isBackSpacePressed) {
      value = formatPhoneNumber(phoneNumber);
    }
    setNewAuthDevice(value);
    if (!isValidMobileNumber(value) && !(value.length == 0)) {
      updateInvalidError(['Invalid Phone Number']);
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
  const keyDownCallBack = (keyCode: string) => {
    isBackSpacePressed = keyCode == 'Backspace';
  };
  const pages = [
    <ChangeAuthDeviceSlide
      key={0}
      label="Text Message Setup"
      subLabel="Enter the phone number you'd like to use for Communications and Security Settings"
      bottomNote="By sending the code I agree to receive a one-time security code. Message and data rates may apply, Subject to terms and confictions."
      actionArea={
        <TextField
          valueCallback={(val) => validatePhoneNumber(val)}
          onKeydownCallback={(val) => keyDownCallBack(val)}
          label="Phone Number"
          value={newAuthDevice}
          errors={invalidErrors}
        />
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        isValidMobileNumber(newAuthDevice)
          ? () => initNewDevice(false)
          : undefined
      }
    />,
    <InputModalSlide
      key={1}
      label={headerText}
      subLabel="Enter the security code sent to you phone number to complete text message setup. We've sent a code to:"
      actionArea={
        <Column>
          <TextBox className="font-bold text-center" text={mainAuthDevice} />
          <Spacer size={32} />
          <TextField
            valueCallback={(val) => updateSecurityCode(val)}
            label="Enter Security Code"
            errors={verifyMfaResult?.errors}
          />
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
      nextCallback={confirmCode.length > 5 ? () => submitCode() : undefined}
      cancelCallback={() => dismissModal()}
    />, // MfaEntry
    <SuccessSlide
      key={2}
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
      key={3}
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
