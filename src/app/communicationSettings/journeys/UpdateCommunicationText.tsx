import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
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
import {
  formatPhoneNumber,
  isValidMobileNumber,
  validateLength,
} from '@/utils/inputValidator';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { saveDataAction } from '../actions/communicationSettingsAction';

import {
  CommunicationSettingsSaveRequest,
  ContactPreference,
} from '../models/app/communicationSettingsAppData';

interface UpdateCommunicationTextProps {
  onRequestPhoneNoSuccessCallBack: (arg0: string) => void;
  phone: string;
  email: string;
  preferenceData: ContactPreference[];
}

export const UpdateCommunicationText = ({
  changePage,
  pageIndex,
  onRequestPhoneNoSuccessCallBack,
  phone,
  email,
  preferenceData,
}: ModalChildProps & UpdateCommunicationTextProps) => {
  const { dismissModal } = useAppModalStore();
  const [newAuthDevice, setNewAuthDevice] = useState(phone);
  const [mainAuthDevice, setMainAuthDevice] = useState(phone);
  const [error, setError] = useState('');
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    if (pageIndex === 0) {
      setNewAuthDevice(phone);
      setError('');
      setNextDisabled(true);
    }
  }, [pageIndex, phone]);

  const initNewDevice = async () => {
    try {
      if (newAuthDevice === '') {
        setNewAuthDevice(mainAuthDevice);
      } else {
        setMainAuthDevice(newAuthDevice);
      }

      const selectedPreferences: CommunicationSettingsSaveRequest = {
        mobileNumber: newAuthDevice.replace(/\D/g, ''),
        emailAddress: email,
        contactPreference: preferenceData,
        memberKey: '',
        subscriberKey: '',
        groupKey: '',
        lineOfBusiness: '',
      };
      const response = await saveDataAction(selectedPreferences);
      if (response.details?.componentStatus === 'Success') {
        onRequestPhoneNoSuccessCallBack(newAuthDevice);
        changePage?.(1, false);
      } else {
        changePage?.(2, false);
      }
    } catch (errorMessage: unknown) {
      console.error('Error updating the phone', errorMessage);
      changePage?.(2, false);
    }
  };

  const validatePhoneNumber = (value: string) => {
    setNewAuthDevice(value);
    const isValidPhone = isValidMobileNumber(value);
    const isValidLength = validateLength(value);

    if (!isValidPhone || !isValidLength) {
      setError('Please enter a valid Phone number.');
      setNextDisabled(true);
      console.log('Invalid phone number:', value);
      return;
    }
    if (value === '') {
      setError('');
      setNextDisabled(true);
      return;
    }
    setError('');
    setNextDisabled(false);
  };

  const getNextCallback = (
    newAuthDevice: string,
    initNewDevice: () => void,
  ): (() => void) | undefined => {
    if (isValidMobileNumber(newAuthDevice)) {
      return () => initNewDevice();
    }
    return undefined;
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Update Phone Number"
      subLabel="Enter the phone number you'll like to use for communication and security settings. You'll need to update your multi-factor authentication phone number separately."
      buttonLabel="Next"
      actionArea={
        <Column>
          <Spacer size={32} />
          <TextField
            value={newAuthDevice}
            valueCallback={(val) => validatePhoneNumber(val)}
            label="Phone Number"
          />
          <Spacer size={16} />
          {error && (
            <div className="text-red-500 m-2 mt-0 ml-0">
              <Row>
                <Image src={alertErrorSvg} className="icon mt-1" alt="" />
                <TextBox className="body-1 pt-1.5 ml-2" text={error} />
              </Row>
            </div>
          )}
        </Column>
      }
      nextCallback={
        nextDisabled ? undefined : getNextCallback(newAuthDevice, initNewDevice)
      }
      cancelCallback={() => dismissModal()}
    />,

    <SuccessSlide
      key={1}
      label="Phone Number Updated"
      body={
        <Column className="items-center">
          <TextBox className="text-center" text="Your phone number is:" />
          <Spacer size={16} />
          <TextBox
            className="font-bold"
            text={formatPhoneNumber(newAuthDevice)}
          />
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
