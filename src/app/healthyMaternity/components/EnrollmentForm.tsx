import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Radio } from '@/components/foundation/Radio';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { IComponent } from '@/components/IComponent';
import { useState } from 'react';

interface EnrollmentFormProps extends IComponent {
  accessCode: string;
}

export const EnrollmentForm = ({ accessCode }: EnrollmentFormProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isStep1ButtonClicked, setStep1ButtonState] = useState(false);

  function navigateContent() {
    setStep1ButtonState(!isStep1ButtonClicked);
  }

  const [isStep2ButtonClicked, setStep2ButtonState] = useState(false);

  function navigateSuccessPage() {
    setStep2ButtonState(!isStep2ButtonClicked);
  }

  const [isChecked, setIsChecked] = useState(false);
  const [emailAgreement, setEmailAgreement] = useState(false);
  const [appLinkAgreement, setAppLinkAgreement] = useState(false);

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  function memberInfo() {
    return (
      <Card className="large-section">
        <section className="w-4/5 m-auto stepSection">
          <TextBox text="1" className="stepRoundBlue" />
          <Divider size={5} className="stepLineGrey" />
          <TextBox text="2" className="stepRoundGrey" />
          <Divider size={5} className="stepLineGrey" />
          <TextBox text="3" className="stepRoundGrey" />
          <Spacer size={18} />
          <TextBox text="Member Information" />
          <Spacer size={18} />
          <TextField label="Member Name" />
          <Spacer size={8} />
          <TextField label="Date of Birth (MM/DD/YYYY)" />
          <Spacer size={8} />
          <TextField label="Due Date of Baby (MM/DD/YYYY)" />
          <Spacer size={8} />
          <TextField label="Email Address" type="email" />
          <Spacer size={8} />
          <TextField label="Phone Number" />
          <Checkbox
            label="By checking this box I agree to BlueCross, its affiliates and its service providers sending me communications via email. Unencrypted email may possibly be intercepted and read by people other than those it's addressed to."
            checked={emailAgreement}
            onChange={(newValue) => setEmailAgreement(newValue)}
          />
          <Spacer size={8} />
          <Button label="Next" callback={navigateContent} />
        </section>
      </Card>
    );
  }

  function contactMethod() {
    return (
      <Card className="large-section">
        <section className="w-4/5 m-auto stepSection">
          <TextBox text="1" className="stepRoundBlue" />
          <Divider size={5} className="stepLineBlue" />
          <TextBox text="2" className="stepRoundBlue" />
          <Divider size={5} className="stepLineGrey" />
          <TextBox text="3" className="stepRoundGrey" />
          <Spacer size={18} />
          <TextBox text="Preferred Contact Method" />
          <Spacer size={18} />
          <TextBox text="I prefer that my healthy maternity nurse contacts me via:" />
          <Spacer size={8} />
          <Radio
            selected={false}
            callback={checkHandler}
            label="Messages in the CareTN app"
            subLabel="You'll need a compatible Apple or Android mobile device. Your nurse may call you but most of the time they'll message you through the app."
          />
          <Spacer size={12} />
          <Radio
            label="Phone call"
            selected={false}
            subLabel="Your nurse will call you during your pregnancy."
          />
          <Spacer size={18} />
          {isChecked && (
            <>
              <TextBox text="Check the box to get help downloading the CareTN app:" />
              <Checkbox
                label="Text me a link to the CareTN app."
                checked={appLinkAgreement}
                onChange={(newValue) => setAppLinkAgreement(newValue)}
              />
            </>
          )}
          <Spacer size={18} />
          <Row>
            <Button label="Back" type="secondary" callback={navigateContent} />
            <Spacer size={18} axis="horizontal" />
            <Button label="Next" callback={navigateSuccessPage} />
          </Row>
        </section>
      </Card>
    );
  }

  function successContent() {
    return (
      <Card className="large-section">
        <section className="w-4/5 m-auto text-center stepSection">
          <TextBox text="1" className="stepRoundBlue" />
          <Divider size={5} className="stepLineBlue" />
          <TextBox text="2" className="stepRoundBlue" />
          <Divider size={5} className="stepLineBlue" />
          <TextBox text="3" className="stepRoundBlue" />
          <Spacer size={18} />
          <Column className="items-center">
            <img
              className="size-[80px]"
              src="/assets/success.svg"
              alt="success"
            />
            <Spacer size={24} />
            <Header
              className="title-2"
              text="You're Enrolled in the Healthy Maternity Program"
            />
            <Spacer size={16} />
            <Column>
              <TextBox
                type="body-2"
                text="We'll review your information and a nurse will reach out to you soon."
              />
              <Spacer size={18} />
              <Divider />
              <Spacer size={18} />
              <TextBox text="Next Steps" />
              <Spacer size={8} />
              <TextBox
                type="body-2"
                text="Download the CareTN app and enter the access code below to set up your account."
              />
              <Spacer size={9} />
              <Column className="py-3 px-7 accessCodeBackground">
                <TextBox text="Access Code" type="body-2" />
                <TextBox text={accessCode} className="font-bold" />
              </Column>
            </Column>
          </Column>
        </section>
      </Card>
    );
  }

  return (
    <Card className="large-section">
      <section>
        <Header
          text="Enroll in Health Maternity"
          className="title-2 font-bold"
        />
        <Spacer size={8} />
        <TextBox text="Please confirm your details below." />
        <Spacer size={16} />
        {!isStep1ButtonClicked && memberInfo()}
        {isStep1ButtonClicked && !isStep2ButtonClicked && contactMethod()}
        {isStep2ButtonClicked && successContent()}
      </section>
    </Card>
  );
};

export default EnrollmentForm;
