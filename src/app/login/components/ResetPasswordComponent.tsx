import { SuccessSlide } from '@/components/composite/SuccessSlide';
import { Button } from '@/components/foundation/Button';
import { Circle } from '@/components/foundation/Circle';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { ToolTip } from '@/components/foundation/Tooltip';
import {
  formatDate,
  isValidPassword,
  validateDate,
} from '@/utils/inputValidator';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export const ResetPasswordComponent = () => {
  const instructions = [
    'At least one uppercase letter',
    'At least one lowercase letter',
    'At least one number',
    '8-30 characters long',
    'At least one special character (! @ # $ % ^ & ( ) - _ + = )',
    'Cannot be any of your last 10 passwords',
    'Cannot be a commonly used password',
  ];
  const [invalidDate, setInvalidDate] = useState<string[]>([]);
  const [invalidPassword, setInvalidPassword] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  let isBackSpacePressed: boolean = false;
  const router = useRouter();

  const handleChange = (val: string) => {
    let formattedDate = val;
    if (!isBackSpacePressed) {
      formattedDate = formatDate(val);
    }
    setDate(formattedDate);
    if (!validateDate(date)) {
      setInvalidDate(['Please enter a valid date.']);
    } else {
      setInvalidDate([]);
    }
  };
  const keyDownCallBack = (keyCode: string) => {
    isBackSpacePressed = keyCode == 'Backspace';
  };
  const updatePassword = (val: string) => {
    setPassword(val);
    if (!isValidPassword(val)) {
      setInvalidPassword(['Please enter a valid password.']);
    } else {
      setInvalidPassword([]);
    }
  };
  const resetPassword = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setShowSuccess(true);
  };
  const enableReset = (): boolean => {
    return (
      password.length > 0 &&
      date.length > 0 &&
      !invalidDate.length &&
      !invalidPassword.length
    );
  };

  return (
    <form
      onSubmit={(e) => {
        enableReset() ? resetPassword(e) : undefined;
      }}
    >
      {!showSuccess ? (
        <section id="mainSection">
          <Header className="title-2" text="Reset Your Password"></Header>
          <Spacer size={16} />
          <TextBox
            ariaLabel="We've updated our security requirements. Please verify your date of birth and reset your password to continue."
            text="We've updated our security requirements. Please verify your date of birth and reset your password to continue."
          />
          <Spacer size={16} />
          <section>
            <ul>
              {instructions.map((item, index) => (
                <li className="my-2" key={index}>
                  <Row>
                    <Circle
                      width={4}
                      height={4}
                      color="#5DC1FD"
                      radius={50}
                      top={8}
                      right={8}
                    />
                    <TextBox text={item} />
                  </Row>
                </li>
              ))}
            </ul>
          </section>
          <Spacer size={32} />
          <TextField
            ariaLabel="Date of Birth (MM/DD/YYYY)"
            label="Date of Birth (MM/DD/YYYY)"
            valueCallback={(val) => handleChange(val)}
            onKeydownCallback={(val) => keyDownCallBack(val)}
            value={date}
            errors={invalidDate}
            maxLength={10}
            hint="__ /__ /____"
          ></TextField>
          <Spacer size={32} />
          <TextField
            type="password"
            label="New Password"
            valueCallback={(val) => {
              updatePassword(val);
            }}
            highlightError={false}
            errors={invalidPassword}
            isSuffixNeeded={true}
          />
          <Spacer size={32} />
          <ToolTip
            showTooltip={!enableReset()}
            className="flex flex-row justify-center items-center tooltip"
            label="Enter your date of birth and new password to continue."
          >
            <Button
              callback={enableReset() ? resetPassword : undefined}
              style="submit"
              label="Reset Password"
            />
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
                Give us a call using the number listed on the back of your
                Member ID card or{' '}
              </span>,
              <span className="link" key={1}>
                <a href={process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL ?? ''}>
                  contact us
                </a>
              </span>,
            ]}
          />
        </section>
      ) : (
        <section id="mainSection">
          <SuccessSlide
            label="You're all set!"
            btnLabel="Continue"
            body={
              <Column className="items-center ">
                <TextBox
                  className="text-center"
                  text="You've successfully reset your password."
                />
              </Column>
            }
            doneCallBack={() =>
              router.replace(
                process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || '/security',
              )
            }
          />
        </section>
      )}
    </form>
  );
};
