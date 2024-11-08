import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { downIcon } from '@/components/foundation/Icons';
import { RichDropDown } from '@/components/foundation/RichDropDown';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import { SetStateAction, useState } from 'react';
import { DropDownDetails } from './models/dropdown_details';

interface SendAnEmailFormProps extends IComponent {
  nameDropdown: DropDownDetails[];
  selectedName: DropDownDetails;
  topicsDropdown: DropDownDetails[];
  selectedtopic: DropDownDetails;
  onSelectedDateChange: () => unknown;
}

const SendAnEmailForm = ({
  topicsDropdown,
  nameDropdown,
  selectedtopic,
  selectedName,
}: SendAnEmailFormProps) => {
  const [messageValue, setMessageValue] = useState('');
  const [selectedDropDownTopic, setDropdownTopicSelected] =
    useState(selectedtopic);
  const handleMessageChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setMessageValue(e.target.value);
  };
  const setTopicOption = (option: DropDownDetails) => {
    setDropdownTopicSelected(option);
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
          className="border"
          minWidth="min-w-[280px]"
          headBuilder={(val) => <DropDownHead user={val} />}
          itemData={nameDropdown}
          itemsBuilder={(data, index) => (
            <DropDownTile user={data} key={index} />
          )}
          selected={selectedName}
          onSelectItem={() => {}}
        />
        <Spacer size={24} />
        <TextBox className="body-1" text="What can we help you with?" />
        <RichDropDown
          className="border"
          minWidth="min-w-[280px]"
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
        <textarea
          id="example-textarea"
          value={messageValue}
          onChange={handleMessageChange}
          className="block w-full px-4 py-2 border border-gray-300  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none overflow-y-auto h-[240px]"
          placeholder="Add your message here..."
        ></textarea>
        <Spacer size={32} />
        <Button label="Send Email" callback={() => null} />
      </Column>
    </Card>
  );
};

export default SendAnEmailForm;

const DropDownTile = ({ user }: { user: DropDownDetails }) => {
  return (
    <Column className="border-none flex-grow">
      <TextBox type="body-1" text={`${user.label}`} />
    </Column>
  );
};

const DropDownHead = ({ user }: { user: DropDownDetails }) => {
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
