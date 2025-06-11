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
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import alertErrorSvg from '@/public/assets/alert_error_red.svg';
import { isValidEmailAddress, validateLength } from '@/utils/inputValidator';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { invokeUpdateEmailAddress } from '../actions/emailUniquenessAction';
import { EmailUniquenessRequest } from '../models/api/emailUniqueness';

const headerText = 'Confirm Email Address';

interface UpdateCommunicationEmailProps {
  email: string;
  onRequestEmailSuccessCallBack: (arg0: string) => void;
}

export const UpdateCommunicationEmail = ({
  changePage,
  pageIndex,
  email,
  onRequestEmailSuccessCallBack,
}: ModalChildProps & UpdateCommunicationEmailProps) => {
  const { dismissModal } = useAppModalStore();
  const [mainAuthDevice, setMainAuthDevice] = useState(email);
  const [newAuthDevice, setNewAuthDevice] = useState(email);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const [error, setError] = useState('');
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    if (pageIndex === 0) {
      setNewAuthDevice(email);
      setConfirmEmail('');
      setConfirmCode('');
      setShowConfirmEmail(false);
      setError('');
      setNextDisabled(true);
    }
  }, [pageIndex, email]);

  const initNewDevice = async () => {
    try {
      let emailToUse = newAuthDevice;
      if (newAuthDevice === '') {
        emailToUse = mainAuthDevice;
        setNewAuthDevice(mainAuthDevice);
      } else {
        setMainAuthDevice(newAuthDevice);
      }
      const emailRequest: EmailUniquenessRequest = {
        emailAddress: emailToUse,
        memberKey: '',
        subscriberKey: '',
      };
      const response = await invokeUpdateEmailAddress(emailRequest);
      if (response.errorCode === 'RE-400-17') {
        setError(
          'The email address entered is already in use by another account. Please choose a different email address.',
        );
        setNextDisabled(true); // Disable the Next button if there's an error
      } else if (response.errorCode === '2999') {
        setError(
          'The email address you provided is invalid or it’s from a domain we don’t allow. Please choose another email address.',
        );
        setNextDisabled(true); // Disable the Next button if there's an error
      } else if (response.details?.componentStatus === 'Success') {
        changePage?.(2, false);
        onRequestEmailSuccessCallBack(newAuthDevice);
      } else {
        changePage?.(3, false);
      }
    } catch (errorMessage: unknown) {
      changePage?.(3, false);
      console.error(
        'error in emailUniqueness for updating the email',
        errorMessage,
      );
    }
  };

  const submitCode = async () => {
    // Do API call for submit code
    changePage?.(2, false);
  };

  const validateEmailAddress = (value: string) => {
    setNewAuthDevice(value);
    const isValidEmail = isValidEmailAddress(value);
    const isValidLength = validateLength(value);

    if (!isValidEmail || !isValidLength) {
      setError('Please enter a valid address.');
      setShowConfirmEmail(false);
      return;
    }
    if (value === '') {
      setError('');
      setShowConfirmEmail(false);
      return;
    }
    setShowConfirmEmail(true);
    setError('');
  };

  const handleConfirmEmailChange = (val: string) => {
    setConfirmEmail(val);
    if (val === '') {
      setError('');
    } else if (val !== newAuthDevice) {
      setError('The email addresses must match. Please check and try again.');
    } else {
      setError('');
    }
    setNextDisabled(false);
  };

  const getNextCallback = (
    newAuthDevice: string,
    confirmEmail: string,
    initNewDevice: () => void,
  ): (() => void) | undefined => {
    if (isValidEmailAddress(newAuthDevice) && newAuthDevice === confirmEmail) {
      return () => initNewDevice();
    }
    return undefined;
  };

  const pages = [
    <ChangeAuthDeviceSlide
      key={0}
      label="Update Email Address"
      subLabel=" Enter the email address you'll like to use for communication and security settings. You'll need to update your multi-factor authentication email address separately."
      actionArea={
        <Column>
          <TextField
            value={newAuthDevice}
            valueCallback={(val) => validateEmailAddress(val)}
            label="Email Address"
            type="email"
          />
          {showConfirmEmail && (
            <Column>
              <Spacer size={32} />
              <TextField
                value={confirmEmail}
                valueCallback={handleConfirmEmailChange}
                label="Confirm Email"
              />
            </Column>
          )}
          {error && (
            <div className="text-red-500 mt-2">
              <Row>
                <Image src={alertErrorSvg} className="icon mt-1" alt="" />
                <TextBox className="body-1 pt-1.5 ml-2" text={error} />
              </Row>
            </div>
          )}
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        nextDisabled
          ? undefined
          : getNextCallback(newAuthDevice, confirmEmail, initNewDevice)
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
            value={confirmCode}
            valueCallback={(val) => setConfirmCode(val)}
            label="Enter Security Code"
          />
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
    <ErrorDisplaySlide
      key={3}
      label="Something went wrong."
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="We’re unable to update your information at this time. Please try again later."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
