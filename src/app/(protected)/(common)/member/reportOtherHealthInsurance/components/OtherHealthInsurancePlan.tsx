import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import SelectMemberPlan from './SelectMemberPlan';
interface OtherHealthInsurancePlanProps {
  checkboxState: {
    medicarePlan: boolean;
    medicalPlan: boolean;
    dentalPlan: boolean;
  };
  onCheckboxChange: (checkboxValue: string[]) => void;
  selectedData: boolean;
}

const OtherHealthInsurancePlan: React.FC<OtherHealthInsurancePlanProps> = ({
  checkboxState,
  onCheckboxChange,
  selectedData,
}) => {
  const handleChange = (checkboxValue: string[]) => {
    onCheckboxChange(checkboxValue);
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
            callback={() => handleChange(['medicarePlan'])}
            classProps={
              checkboxState.medicalPlan || checkboxState.dentalPlan
                ? disabledClass
                : ''
            }
            selected={checkboxState.medicarePlan}
          ></Checkbox>
          <Spacer size={8} />
          <Checkbox
            label={'Medical Plan'}
            callback={() => handleChange(['medicalPlan'])}
            classProps={checkboxState.medicarePlan ? disabledClass : ''}
            selected={checkboxState.medicalPlan}
          ></Checkbox>
          <Spacer size={8} />
          <Checkbox
            label={'Dental Plan'}
            callback={() => handleChange(['dentalPlan'])}
            classProps={checkboxState.medicarePlan ? disabledClass : ''}
            selected={checkboxState.dentalPlan}
          ></Checkbox>
          <Spacer size={32} />
        </Column>
      )}
      {!selectedData && (
        <Column>
          <SelectMemberPlan selectedCheckbox={null} />
        </Column>
      )}
    </main>
  );
};

export default OtherHealthInsurancePlan;
