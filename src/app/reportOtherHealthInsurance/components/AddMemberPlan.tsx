import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { useState } from 'react';

interface AddMemberPlanProps {
  selectedCheckbox: string[] | null;
}
const AddMemberPlan: React.FC<AddMemberPlanProps> = ({ selectedCheckbox }) => {
  const [selectedMemberData, setSelectedMemberData] = useState(false);
  function handleClick() {
    setSelectedMemberData(true);
    setSelectedMemberData(!selectedMemberData);
  }
  return (
    <main>
      <Column className="items-center">
        {selectedCheckbox && (
          <Header
            type="title-2"
            text={
              selectedCheckbox.includes('medicarePlan')
                ? 'Add Medicare Plan'
                : selectedCheckbox.includes('medicalPlan')
                  ? 'Add Medical Plan'
                  : selectedCheckbox.includes('dentalPlan')
                    ? 'Add Dental Plan'
                    : ''
            }
          />
        )}

        <Spacer size={32} />
        <TextBox
          className="body-1 w-[130%] text-center"
          text="Tell us about your other insurance. All fields are required unless
          noted as optional."
        />
        <Spacer size={32} />
      </Column>
      <Column className="items-left">
        <TextBox className="title-3 !items-left" text="Insurance Company" />
        <Spacer size={24} />
        <TextField label="Company Name" />
        <Spacer size={24} />
        <TextField label="Policy Identification Number" />
        <Spacer size={24} />
        <TextField label="Company Phone Number" />
        <Spacer size={24} />
        <TextBox
          className="body-1"
          text="Is this coverage part of a court order? (if applicable, optional)"
        />
        <Spacer size={24} />
        <Radio
          label="Yes"
          selected={selectedMemberData}
          callback={handleClick}
        />
        <Radio
          selected={!selectedMemberData}
          callback={handleClick}
          label="No"
        />
        <Spacer size={8} />
        {selectedCheckbox && selectedCheckbox.includes('medicarePlan') && (
          <Column>
            <TextBox
              className="body-1"
              text="Policy type (check all that apply):"
            />
            <Spacer size={16} />

            <Checkbox label={'Medicare Part A'} classProps="!p-0"></Checkbox>
            <Spacer size={8} />
            <Checkbox label={'Medicare Part B'}></Checkbox>
            <Spacer size={8} />
            <Checkbox label={'Medicare Part D'}></Checkbox>
          </Column>
        )}
        <Spacer size={16} />
        <TextBox className="title-3" text="Policyholder Information" />
        <Spacer size={24} />
        <TextField label="Policyholder First Name" />
        <Spacer size={8} />
        <TextField label="Policyholder Last Name" />
        <Spacer size={16} />
        {selectedCheckbox && selectedCheckbox.includes('medicarePlan') && (
          <Column>
            <TextBox
              className="body-1"
              text="Is this member eligible for Medicare due to disability?"
            />
            <Spacer size={16} />
            <Radio
              selected={selectedMemberData}
              callback={handleClick}
              label="Yes"
            />
            <Spacer size={8} />
            <Radio
              label="No"
              selected={!selectedMemberData}
              callback={handleClick}
            />
            <Spacer size={16} />
            <TextBox
              className="body-1"
              text="Is this member eligible for Medicare due to End Stage Renal
              Disease?"
            />
            <Spacer size={16} />
            <Radio
              selected={selectedMemberData}
              callback={handleClick}
              label="Yes"
            />
            <Spacer size={8} />
            <Radio
              label="No"
              selected={!selectedMemberData}
              callback={handleClick}
            />
            <Spacer size={16} />
            <TextBox className="body-1" text="Is this member still employed?" />
            <Spacer size={16} />
            <Radio
              selected={selectedMemberData}
              callback={handleClick}
              label="Yes"
            />
            <Spacer size={8} />
            <Radio
              label="No"
              selected={!selectedMemberData}
              callback={handleClick}
            />
            <Spacer size={8} />
            <TextBox
              className="body-1"
              text="Check the box if this statement applies:"
            />
            <Spacer size={8} />
            <Checkbox label={'This member is over 65.'}></Checkbox>
            <Spacer size={32} />
          </Column>
        )}
      </Column>
    </main>
  );
};

export default AddMemberPlan;
