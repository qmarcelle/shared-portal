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

const bottomNote =
  'By sending the code I agree to receive a one-time security code. Message and data rates may apply, Subject to terms and conditions.';

interface UpdateCommunicationTextProps {
  initNumber: string;
  phone: string;
}

export const UpdateCommunicationText = ({
  changePage,
  pageIndex,
  initNumber,
  phone,
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
      setNextDisabled(false);
    }
  }, [pageIndex, phone]);

  const initNewDevice = async () => {
    try {
      if (newAuthDevice === '') {
        setNewAuthDevice(mainAuthDevice);
      } else {
        setMainAuthDevice(newAuthDevice);
      }
      changePage?.(1, true); // Change to page 1 on successful validation
      setNextDisabled(true);
    } catch (errorMessage: unknown) {
      console.error('Error updating the phone', errorMessage);
      setNextDisabled(true);
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
      subLabel="Enter the new phone number you'd like to use for communications and security settings."
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
            <Radio
              label={`Text a code to ${formatPhoneNumber(newAuthDevice)}`}
              selected={true}
            />{' '}
            <Radio
              label={`Call with a code to ${formatPhoneNumber(newAuthDevice)}`}
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
