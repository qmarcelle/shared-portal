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
import { alertErrorIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { AnalyticsData } from '@/models/app/analyticsData';
import { AppProg } from '@/models/app_prog';
import { ComponentDetails } from '@/models/component_details';
import { ESResponse } from '@/models/enterprise/esResponse';
import { googleAnalytics } from '@/utils/analytics';
import { isValidEmailAddress, validateLength } from '@/utils/inputValidator';
import Image from 'next/image';
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
  const [confirmEmail, setConfirmEmail] = useState('');

  // const [emailError, setemailError] = useState<string[]>([]);
  useEffect(() => {
    updateInvalidError([]);
  }, [updateInvalidError]);

  const addMFAEmailAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'resend code',
      click_url: undefined,
      element_category: 'email setup',
      action: 'resend code',
      event: 'select_content',
      content_type: 'select',
    };
    googleAnalytics(analytics);
  };
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
        addMFAEmailAnalytics();
        setResentCode(true);
      } else {
        setResentCode(false);
      }
      await updateMfaDevice(MfaDeviceType.email, email);
      changePageIndex?.(1, true);
    } catch (errorMessage: unknown) {
      if (
        (errorMessage as ESResponse<VerifyMfaResponse>).errorCode == 'RE-400-17'
      ) {
        updateInvalidError([
          'The email address entered is already in use by another account. Please choose a different email address.',
        ]);
      } else {
        changePageIndex?.(3, true);
      }
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
      changePageIndex?.(3, true);
    }
  };

  /* const sendCode = async () => {
    initNewDevice(false);
    changePageIndex?.(1, true);
  }; */

  const validateEmailAddress = (value: string) => {
    setNewAuthDevice(value);
    const isValidEmail = isValidEmailAddress(value);
    const isValidLength = validateLength(value);

    if (!isValidEmail || !isValidLength) {
      updateInvalidError(['Invalid Email Address']);
    } else if (confirmEmail && value !== confirmEmail) {
      updateInvalidError([
        'The email addresses must match. Please check and try again.',
      ]);
    } else {
      updateInvalidError([]);
    }
  };

  const handleConfirmEmailChange = (val: string) => {
    setConfirmEmail(val);
    if (invalidErrors?.length && invalidErrors[0] === 'Invalid Email Address') {
      return;
    }
    if (val && val !== newAuthDevice) {
      updateInvalidError([
        'The email addresses must match. Please check and try again.',
      ]);
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
    <ChangeAuthDeviceSlide
      key={0}
      label="Email Setup"
      subLabel="Enter the email address you'd like to use for communications and security settings."
      actionArea={
        <Column>
          <TextField
            valueCallback={(val) => validateEmailAddress(val)}
            label="Email Address"
            type="email"
            value={newAuthDevice}
          />

          <Column>
            <Spacer size={32} />
            <TextField
              value={confirmEmail}
              valueCallback={handleConfirmEmailChange}
              label="Confirm Email"
            />
          </Column>

          {invalidErrors != undefined && invalidErrors[0] && (
            <div className="text-red-500 mt-2">
              <Row>
                <Image src={alertErrorIcon} className="icon mt-1" alt="" />
                <TextBox
                  className="body-1 pt-1.5 ml-2"
                  text={invalidErrors[0]}
                />
              </Row>
            </div>
          )}
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        !!newAuthDevice && !!confirmEmail && !invalidErrors?.length
          ? () => initNewDevice(false)
          : undefined
      }
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
    <ErrorDisplaySlide
      key={3}
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
