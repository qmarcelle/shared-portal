import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

import React, { useState } from 'react';
interface SelectMemberPlanProps {
  selectedCheckbox: string[] | null;
}

const SelectMemberPlan: React.FC<SelectMemberPlanProps> = ({
  selectedCheckbox,
}) => {
  const [selectedOption, setSelectedOption] = useState<'all' | 'selected'>(
    'selected',
  );
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([
    'Chris Hall',
  ]);

  // Handles radio button change
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event as unknown as 'all' | 'selected');
  };

  // Handles checkbox change
  const handleCheckboxChange = (label: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (val: any) => {
      if (val.target?.checked) {
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
            <TextBox className="body-1" text="[Company Name]" />
            <TextBox className="body-1" text="[Policy Identification #]" />
            <TextBox className="body-1" text="[Policy Start Date]" />
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

            <Checkbox
              label={'Chris Hall'}
              selected={selectedCheckboxes.includes('Chris Hall')}
              callback={handleCheckboxChange('Chris Hall')}
            ></Checkbox>
            <Spacer size={8} />
            <Checkbox
              label={'Maddison Hall'}
              selected={selectedCheckboxes.includes('Maddison Hall')}
              callback={handleCheckboxChange('Maddison Hall')}
            ></Checkbox>
            <Spacer size={8} />
            <Checkbox
              label={'Forrest Hall'}
              selected={selectedCheckboxes.includes('Forrest Hall')}
              callback={handleCheckboxChange('Forrest Hall')}
            ></Checkbox>
            <Spacer size={8} />
            <Checkbox
              label={'Corey Hall'}
              selected={selectedCheckboxes.includes('Corey Hall')}
              callback={handleCheckboxChange('Corey Hall')}
            ></Checkbox>
            <Spacer size={8} />
            <Checkbox
              label={'Telly Hall'}
              selected={selectedCheckboxes.includes('Telly Hall')}
              callback={handleCheckboxChange('Telly Hall')}
            ></Checkbox>
            <Spacer size={8} />
            <Checkbox
              label={'Janie Hall'}
              selected={selectedCheckboxes.includes('Janie Hall')}
              callback={handleCheckboxChange('Janie Hall')}
            ></Checkbox>
            <Spacer size={32} />
          </Column>
        )}
      </Column>
    </main>
  );
};

export default SelectMemberPlan;
