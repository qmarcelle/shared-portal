import { MemberData } from '@/actions/loggedUserInfo';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import React from 'react';

interface SelectMemberPlanProps {
  selectedCheckbox: string[] | null;
  selectedOption: 'all' | 'selected';
  setSelectedOption: React.Dispatch<React.SetStateAction<'all' | 'selected'>>;
  selectedCheckboxes: string[];
  setSelectedCheckboxes: React.Dispatch<React.SetStateAction<string[]>>;
  membersData?: MemberData[];
  otherInsuranceCompanyName?: string;
  otherInsurancePolicyNumber?: string;
  otherInsuranceEffectiveDate?: string;
}

const SelectMemberPlan: React.FC<SelectMemberPlanProps> = ({
  selectedCheckbox,
  selectedOption,
  setSelectedOption,
  selectedCheckboxes,
  setSelectedCheckboxes,
  membersData,
  otherInsuranceCompanyName,
  otherInsurancePolicyNumber,
  otherInsuranceEffectiveDate,
}) => {
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value as 'all' | 'selected');
  };

  const handleCheckboxChange = (label: string) => {
    return (val: boolean) => {
      if (val) {
        setSelectedCheckboxes((prev) => [...prev, label]);
      } else {
        setSelectedCheckboxes((prev) => prev.filter((item) => item !== label));
      }
    };
  };

  return (
    <main>
      {selectedCheckbox && (
        <Column className="items-center">
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
          <Spacer size={16} />
          <TextBox className="body-1" text="The policy you've entered is:" />
          <Spacer size={16} />
          <Column className="text-center font-bold">
            <TextBox className="body-1" text={otherInsuranceCompanyName!} />
            <TextBox className="body-1" text={otherInsurancePolicyNumber!} />
            <TextBox className="body-1" text={otherInsuranceEffectiveDate!} />
          </Column>
          <Spacer size={16} />
          <TextBox
            className="body-1 w-[130%] text-center"
            text="Do other members of your plan have this other health insurance policy?"
          />
          <Spacer size={32} />
        </Column>
      )}
      {!selectedCheckbox && (
        <Column className="items-center">
          <TextBox className="body-1" text="You've answered:" />
          <Spacer size={16} />
          <TextBox
            className="body-1 font-bold"
            text="No Other Health Insurance"
          />
          <Spacer size={42} />
          <TextBox
            className="body-1 w-[130%] text-center"
            text="Does this apply to other members of your plan?"
          />
          <Spacer size={32} />
        </Column>
      )}
      <Column className="text-left ml-4">
        <Radio
          label="Apply to All Members"
          value="all"
          selected={selectedOption === 'all'}
          callback={handleOptionChange}
        />
        <Spacer size={16} />
        <Radio
          label="Select Members"
          value="selected"
          selected={selectedOption === 'selected'}
          callback={handleOptionChange}
        />
        {selectedOption === 'all' && <Spacer size={16} />}
        {selectedOption === 'selected' && (
          <Column className="ml-7">
            <TextBox
              className="body-1 text-left"
              text="Check all that apply:"
            />
            {membersData &&
              membersData.map((member) => {
                return (
                  <>
                    <Checkbox
                      label={member.name}
                      selected={selectedCheckboxes.includes(member.name)}
                      callback={handleCheckboxChange(member.name)}
                    ></Checkbox>
                    <Spacer size={8} />
                  </>
                );
              })}
            <Spacer size={32} />
          </Column>
        )}
      </Column>
    </main>
  );
};

export default SelectMemberPlan;
