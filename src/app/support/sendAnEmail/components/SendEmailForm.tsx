import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { downIcon } from '@/components/foundation/Icons';
import { RichDropDown } from '@/components/foundation/RichDropDown';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextArea } from '@/components/foundation/TextArea';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { IComponent } from '@/components/IComponent';
import { AppProg } from '@/models/app_prog';
import { FilterDetails } from '@/models/filter_dropdown_details';
import Image from 'next/image';
import { SetStateAction, useState } from 'react';
import { invokeSendEmailAction } from '../actions/sendEmailAction';
import { EmailRequest } from '../models/email_app_data';
import { EmailSuccessFailure } from './EmailSuccessFailure';

interface SendEmailFormProps extends IComponent {
  email: string;
  phone: string;
  nameDropdown: FilterDetails[];
  selectedName: FilterDetails;
  topicsDropdown: FilterDetails[];
  selectedtopic: FilterDetails;
  onSelectedDateChange: () => unknown;
}

const SendEmailForm = ({
  email,
  phone,
  topicsDropdown,
  nameDropdown,
  selectedtopic,
  selectedName,
}: SendEmailFormProps) => {
  const [progress, setProgress] = useState(AppProg.init);

  async function invokeSendEmail(
    messageValue: string,
    selectedDropDownTopic: string,
    selectedNameDropDown: string,
  ) {
    const emailRequest: EmailRequest = {
      memberEmail: email,
      contactNumber: phone,
      message: messageValue,
      categoryValue: selectedDropDownTopic,
      dependentName: selectedNameDropDown,
    };
    const result = await invokeSendEmailAction(
      emailRequest,
      selectedName.value,
    );
    if (result.status == 200) {
      setProgress(AppProg.success);
    } else {
      setProgress(AppProg.failed);
    }
  }
  async function invokeDone() {
    setProgress(AppProg.init);
  }
  function getComponent() {
    switch (progress) {
      case AppProg.init:
        return (
          <SendEmailFormComponent
            email={email}
            nameDropdown={nameDropdown}
            phone={phone}
            selectedName={selectedName}
            selectedtopic={selectedtopic}
            topicsDropdown={topicsDropdown}
            invokeSendEmail={invokeSendEmail}
          />
        );
      case AppProg.success:
        return (
          <EmailSuccessFailure
            key={2}
            label="Got it!"
            isSuccess={true}
            body={
              <Column className="items-center">
                <TextBox
                  className="text-center"
                  text="We’re reading your message and will get back to you at:"
                />
                <Spacer size={8} />
                <TextBox className="text-center font-bold" text={email} />

                <Spacer size={32} />
                <TextBox
                  className="text-center"
                  text="If it’s a weekend or holiday, please give us a little extra time to reply."
                />
              </Column>
            }
          />
        );
      case AppProg.failed:
        return (
          <EmailSuccessFailure
            key={1}
            label="Try Again Later"
            isSuccess={false}
            body={
              <Column className="items-center">
                <TextBox
                  className="text-center"
                  text="We're sorry, something went wrong. Please try again later."
                />
              </Column>
            }
          />
        );
    }
  }
  return (
    <Card className="large-section flex flex-row items-start app-body ">
      <Column className="w-[100%]">
        {getComponent()}
        {progress != AppProg.init && (
          <Button label="Done" callback={() => invokeDone()} />
        )}
      </Column>
    </Card>
  );
};

export default SendEmailForm;

const DropDownTile = ({ user }: { user: FilterDetails }) => {
  return (
    <Column className="border-none flex-grow">
      {user && <TextBox type="body-1" text={user.label} />}
    </Column>
  );
};

const DropDownHead = ({ user }: { user: FilterDetails }) => {
  return (
    <div className="body-1 input">
      <Row className="p-1 items-center">
        <DropDownTile user={user} />
        <Image
          src={downIcon}
          className="w-[20px] h-[20px] ml-2 items-end"
          alt=""
        />
      </Row>
    </div>
  );
};
interface SendEmailFormComponentProps extends IComponent {
  email: string;
  phone: string;
  nameDropdown: FilterDetails[];
  selectedName: FilterDetails;
  topicsDropdown: FilterDetails[];
  selectedtopic: FilterDetails;
  invokeSendEmail: (
    messageValue: string,
    selectedDropDownTopic: string,
    selectedNameDropDown: string,
  ) => void;
}
const SendEmailFormComponent = ({
  email,
  topicsDropdown,
  nameDropdown,
  selectedtopic,
  selectedName,
  invokeSendEmail,
}: SendEmailFormComponentProps) => {
  const [messageValue, setMessageValue] = useState('');
  const [selectedDropDownTopic, setDropdownTopicSelected] =
    useState(selectedtopic);
  const [selectedNameDropDown, setNameSelected] = useState(selectedName);
  const handleMessageChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setMessageValue(e.target.value);
  };
  const setTopicOption = (option: FilterDetails) => {
    setDropdownTopicSelected(option);
  };
  const setNameOption = (option: FilterDetails) => {
    setNameSelected(option);
  };

  const [emailValue, setEmailValue] = useState(email);
  const handleEmailChange = (val: string) => {
    setEmailValue(val);
  };

  return (
    <Column>
      <Header
        text="Email Form"
        type="title-2"
        className="!font-light !text-[26px]/[40px] "
      />
      <Spacer size={16} />
      <TextBox
        className="body-1"
        text="Fill out the form below to send us your message."
      />
      <Spacer size={32} />
      <TextField
        type="text"
        label="We'll send an email reply to:"
        value={emailValue}
        valueCallback={handleEmailChange}
      ></TextField>
      <TextBox
        className="body-2 mt-2"
        text="Changing this email won't change the email we have on file."
      ></TextBox>
      <Spacer size={24} />
      <TextBox className="body-1" text="Who do you need to discuss?" />
      <RichDropDown
        headBuilder={(val) => <DropDownHead user={val} />}
        itemData={nameDropdown}
        itemsBuilder={(data, index) => <DropDownTile user={data} key={index} />}
        selected={selectedNameDropDown}
        onSelectItem={(val) => {
          setNameOption(val);
        }}
      />
      <Spacer size={24} />
      <TextBox className="body-1" text="What can we help you with?" />
      <RichDropDown
        headBuilder={(val) => <DropDownHead user={val} />}
        itemData={topicsDropdown}
        itemsBuilder={(data, index) => <DropDownTile user={data} key={index} />}
        selected={selectedDropDownTopic}
        onSelectItem={(val) => {
          setTopicOption(val);
        }}
      />
      <Spacer size={24} />
      <TextArea
        value={messageValue}
        onChange={handleMessageChange}
        className="block w-full px-4 py-2 border border-[#737373]  rounded-md shadow-sm focus:ring-primary focus:border-primary-focus focus-visible:primary sm:text-sm resize-none overflow-y-scroll h-[240px]"
        placeholder="Add your message here..."
      />
      <Spacer size={32} />

      <Button
        label="Send Email"
        callback={
          messageValue && selectedDropDownTopic.label !== 'Select'
            ? () =>
                invokeSendEmail(
                  messageValue,
                  selectedDropDownTopic.value,
                  selectedNameDropDown.label,
                )
            : undefined
        }
      />
    </Column>
  );
};
