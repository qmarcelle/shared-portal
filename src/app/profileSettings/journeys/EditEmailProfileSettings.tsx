import { invokeUpdateEmailAddress } from '@/app/communicationSettings/actions/emailUniquenessAction';
import { EmailUniquenessRequest } from '@/app/communicationSettings/models/api/emailUniqueness';
import { ChangeAuthDeviceSlide } from '@/components/composite/ChangeAuthDeviceSlide';
import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
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

interface EditEmailSettingsJourneyProps {
  email: string;
}

export const EditEmailProfileSettings = ({
  changePage,
  pageIndex,
  email,
}: ModalChildProps & EditEmailSettingsJourneyProps) => {
  const { dismissModal } = useAppModalStore();

  const [mainAuthDevice, setMainAuthDevice] = useState(email);
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const [error, setError] = useState('');
  const [nextDisabled, setNextDisabled] = useState(false);

  const RE_EMAIL_IN_USE = 'RE-400-17';
  const RE_INVALID_EMAIL = '2999';

  useEffect(() => {
    if (pageIndex === 0) {
      setNewAuthDevice(email);
      setConfirmEmail('');
      setShowConfirmEmail(false);
      setError('');
      setNextDisabled(false);
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
      if (response.errorCode === RE_EMAIL_IN_USE) {
        setError(
          'The email address entered is already in use by another account. Please choose a different email address.',
        );
        setNextDisabled(true); // Disable the Next button if there's an error
      } else if (response.errorCode === RE_INVALID_EMAIL) {
        setError(
          'The email address you provided is invalid or it’s from a domain we don’t allow. Please choose another email address.',
        );
        setNextDisabled(true); // Disable the Next button if there's an error
      } else if (response.details?.componentStatus === 'Success') {
        changePage?.(1, true);
        setShowConfirmEmail(false);
        setNextDisabled(false);
      } else {
        changePage?.(2, true);
      }
    } catch (errorMessage: unknown) {
      changePage?.(2, true);
      console.error(
        'error in emailUniqueness for updating the email',
        errorMessage,
      );
      setNextDisabled(true); // Disable the Next button if there's an error
    }
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
  };

  const validateEmailAddress = (value: string) => {
    setNewAuthDevice(value);
    setNextDisabled(false); // Enable the Next button when user starts typing
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
      subLabel="Enter the new email address you'd like to use for communications and security settings."
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
    <SuccessSlide
      key={1}
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
    <ErrorDisplaySlide
      key={2}
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
