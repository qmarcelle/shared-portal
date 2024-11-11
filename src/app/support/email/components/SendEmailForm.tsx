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
import { FilterDetails } from '@/models/filter_dropdown_details';
import Image from 'next/image';
import { SetStateAction, useState } from 'react';

interface SendEmailFormProps extends IComponent {
  nameDropdown: FilterDetails[];
  selectedName: FilterDetails;
  topicsDropdown: FilterDetails[];
  selectedtopic: FilterDetails;
  onSelectedDateChange: () => unknown;
}

const SendEmailForm = ({
  topicsDropdown,
  nameDropdown,
  selectedtopic,
  selectedName,
}: SendEmailFormProps) => {
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
  return (
    <Card className="large-section flex flex-row items-start app-body ">
      <Column className="w-[100%]">
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
          itemsBuilder={(data, index) => (
            <DropDownTile user={data} key={index} />
          )}
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
          itemsBuilder={(data, index) => (
            <DropDownTile user={data} key={index} />
          )}
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
        <Button label="Send Email" callback={() => null} />
      </Column>
    </Card>
  );
};

export default SendEmailForm;

const DropDownTile = ({ user }: { user: FilterDetails }) => {
  return (
    <Column className="border-none flex-grow">
      <TextBox type="body-1" text={`${user.label}`} />
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
