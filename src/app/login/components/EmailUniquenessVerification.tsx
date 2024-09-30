import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { ToolTip } from '@/components/foundation/Tooltip';
import {
  formatDate,
  isConfirmEmailAddressMatch,
  isValidEmailAddress,
  validateDate,
  validateLength,
} from '@/utils/inputValidator';
import { useState } from 'react';

export const EmailUniquenessVerification = () => {
  const [invalidDate, setInvalidDate] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string[]>([]);
  const [emailConfirmationError, setEmailConfirmationError] = useState<
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
      setEmailConfirmationError([
        'The email addresses must match. Please check and try again.',
      ]);
    } else {
      setEmailConfirmationError([]);
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
      setEmailError(['Please enter a valid Email address.']);
    } else if (isValidEmail && !isValidLength) {
      setEmailError(['Please enter a valid Email address.']);
    } else if (!isValidEmail && isValidLength) {
      setEmailError(['Please enter a valid Email address.']);
    } else {
      setEmailError([]);
    }
    if (
      value !== formEmailData.confirmEmail &&
      formEmailData.confirmEmail !== ''
    ) {
      setEmailConfirmationError([
        'The email addresses must match. Please check and try again.',
      ]);
    } else {
      setEmailConfirmationError([]);
    }
  };
  const keyDownCallBack = (keyCode: string) => {
    isBackSpacePressed = keyCode == 'Backspace';
  };

  return (
    <section id="mainSection">
      <Header className="title-2" text="Choose Your Email Address"></Header>
      <Spacer size={16} />
      <TextBox
        ariaLabel="SubTitle"
        text="Your email is invalid, or the original email address you provided is already associated with another account. Please provide your date of birth and new email address to continue."
      />
      <Spacer size={32} />
      <TextField
        ariaLabel="Date of Birth (MM/DD/YYYY)"
        label="Date of Birth (MM/DD/YYYY)"
        valueCallback={(val) => handleChange(val)}
        onKeydownCallback={(val) => keyDownCallBack(val)}
        value={date}
        errors={invalidDate}
        maxLength={10}
      ></TextField>
      <Spacer size={32} />
      <TextField
        ariaLabel="Email Address"
        label="Email Address"
        valueCallback={(val) => validateEmailAddress(val)}
        type="email"
        errors={emailError}
        value={formEmailData.email}
      ></TextField>
      <Spacer size={32} />
      <TextField
        ariaLabel="Confirm Email Address"
        label="Confirm Email Address"
        type="email"
        value={formEmailData.confirmEmail}
        valueCallback={(val) => confirmEmailAddress(val)}
        errors={emailConfirmationError}
      ></TextField>
      <Spacer size={32} />
      <ToolTip
        showTooltip={true}
        className="flex flex-row justify-center items-center tooltip"
        label="Fill out the form to continue."
      >
        <Button label="Next" />
      </ToolTip>

      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />
      <TextBox
        ariaLabel="Need Help?"
        className="title-3"
        text="Need help?"
      ></TextBox>
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
    </section>
  );
};
