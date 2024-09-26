import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import {
  formatDate,
  isConfirmEmailAddressMatch,
  isValidEmailAddress,
  validateDate,
  validateLength,
} from '@/utils/inputValidator';
import { useState } from 'react';

export const EmailUniqueVerification = () => {
  const [invalidDate, setInvalidDate] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string[]>([]);
  const [emailConfirmationError, setemailConfirmationError] = useState<
    string[]
  >([]);
  const [formEmailData, setFormEmailData] = useState({
    email: '',
    confirmEmail: '',
  });
  const [date, setDate] = useState('');
  let isBackSpacePressed: boolean = false;

  const handleChange = (val: string) => {
    let formattedDate = val;
    if (!isBackSpacePressed) {
      formattedDate = formatDate(val);
    }
    setDate(formattedDate);
    if (!validateDate(date)) {
      setInvalidDate(['Please follow the MM/DD/YYYY format.']);
    } else {
      setInvalidDate([]);
    }
  };

  const confirmEmailAddress = (value: string) => {
    setFormEmailData({
      ...formEmailData,
      ['confirmEmail']: value,
    });
    const isEmailMatch = isConfirmEmailAddressMatch(value, formEmailData.email);
    if (!isEmailMatch) {
      setemailConfirmationError(['Email must match']);
    } else {
      setemailConfirmationError([]);
    }
  };

  const validateEmailAddress = (value: string) => {
    const isValidEmail = isValidEmailAddress(value);
    const isValidLength = validateLength(value);
    setFormEmailData({
      ...formEmailData,
      ['email']: value,
    });
    if (!isValidEmail && !isValidLength) {
      setEmailError(['Invalid Email Address']);
    } else if (isValidEmail && !isValidLength) {
      setEmailError(['Invalid Email Address']);
    } else if (!isValidEmail && isValidLength) {
      setEmailError(['Invalid Email Address']);
    } else {
      setEmailError([]);
    }
    if (
      value !== formEmailData.confirmEmail &&
      formEmailData.confirmEmail !== ''
    ) {
      setemailConfirmationError(['Email must match']);
    } else {
      setemailConfirmationError([]);
    }
  };
  const keyDownCallBack = (keyCode: string) => {
    isBackSpacePressed = keyCode == 'Backspace';
  };

  return (
    <div id="mainSection">
      <Header className="title-2" text="Choose Your Email Address"></Header>
      <Spacer size={16} />
      <TextBox
        className="body-1"
        text="Your email is invalid, or the original email address you provided is already associated with another account. Please provide your date of birth and new email address to continue."
      />
      <Spacer size={32} />
      <TextField
        className="body-1"
        label="Date of Birth (MM/DD/YYYY)"
        valueCallback={(val) => handleChange(val)}
        onKeydownCallback={(val) => keyDownCallBack(val)}
        value={date}
        errors={invalidDate}
        maxLength={10}
      ></TextField>
      <Spacer size={32} />
      <TextField
        className="body-1"
        label="Email Address"
        valueCallback={(val) => validateEmailAddress(val)}
        type="email"
        errors={emailError}
        value={formEmailData.email}
      ></TextField>
      <Spacer size={32} />
      <TextField
        className="body-1"
        label="Confirm Email Address"
        type="email"
        value={formEmailData.confirmEmail}
        valueCallback={(val) => confirmEmailAddress(val)}
        errors={emailConfirmationError}
      ></TextField>
      <Spacer size={32} />
      <Button label="Next" />
      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />
      <TextBox className="title-3" text="Need help?"></TextBox>
      <Spacer size={16} />

      <RichText
        spans={[
          <span key={0}>
            Give us a call using the number listed on the back of your Member ID
            card or{' '}
          </span>,
          <span className="link" key={1}>
            <a href={process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL ?? ''}>
              contact us
            </a>
          </span>,
        ]}
      />
    </div>
  );
};
