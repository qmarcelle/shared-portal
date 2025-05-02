import { MemberData } from '@/actions/loggedUserInfo';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import React from 'react';
import SelectMemberPlan from './SelectMemberPlan';

interface OtherHealthInsurancePlanProps {
  checkboxState: {
    medicarePlan: boolean;
    medicalPlan: boolean;
    dentalPlan: boolean;
  };
  onCheckboxChange: (checkboxValue: string[]) => void;
  selectedData: boolean;
  selectedOption: 'all' | 'selected';
  setSelectedOption: React.Dispatch<React.SetStateAction<'all' | 'selected'>>;
  selectedCheckboxes: string[];
  setSelectedCheckboxes: React.Dispatch<React.SetStateAction<string[]>>;
  membersData: MemberData[];
}

const OtherHealthInsurancePlan: React.FC<OtherHealthInsurancePlanProps> = ({
  checkboxState,
  onCheckboxChange,
  selectedData,
  selectedOption,
  setSelectedOption,
  selectedCheckboxes,
  setSelectedCheckboxes,
  membersData,
}) => {
  const handleChange = (checkboxValue: string[]) => {
    onCheckboxChange(checkboxValue);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value as 'all' | 'selected');
  };

  const handleCheckboxChange = (label: string) => {
    return (val: React.ChangeEvent<HTMLInputElement>) => {
      if (val.target.checked) {
        setSelectedCheckboxes((prev) => [...prev, label]);
      } else {
        setSelectedCheckboxes((prev) => prev.filter((item) => item !== label));
      }
    };
  };

  const disabledClass = 'disabled-checkbox';
  return (
    <main className="max-w-[650px]">
      {selectedData && (
        <Column className="">
          <Row className="body-1 text-center w-96">
            What type of plan is your other health insurance? Check all that
            apply:
          </Row>
          <Spacer size={32} />
          <Checkbox
            label={'Medicare Plan'}
            checked={checkboxState.medicarePlan}
            onChange={() => handleChange(['medicarePlan'])}
            classProps={
              checkboxState.medicalPlan || checkboxState.dentalPlan
                ? disabledClass
                : ''
            }
          ></Checkbox>
          <Spacer size={8} />
          <Checkbox
            label={'Medical Plan'}
            checked={checkboxState.medicalPlan}
            onChange={() => handleChange(['medicalPlan'])}
            classProps={checkboxState.medicarePlan ? disabledClass : ''}
          ></Checkbox>
          <Spacer size={8} />
          <Checkbox
            label={'Dental Plan'}
            checked={checkboxState.dentalPlan}
            onChange={() => handleChange(['dentalPlan'])}
            classProps={checkboxState.medicarePlan ? disabledClass : ''}
          ></Checkbox>
          <Spacer size={32} />
        </Column>
      )}
      {!selectedData && (
        <Column>
          <SelectMemberPlan
            selectedCheckbox={null}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            selectedCheckboxes={selectedCheckboxes}
            setSelectedCheckboxes={setSelectedCheckboxes}
            membersData={membersData}
          />
        </Column>
      )}
    </main>
  );
};

export default OtherHealthInsurancePlan;
