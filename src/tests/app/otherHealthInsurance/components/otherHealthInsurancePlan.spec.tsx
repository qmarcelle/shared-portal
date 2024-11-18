import OtherHealthInsurancePlan from '@/app/reportOtherHealthInsurance/components/OtherHealthInsurancePlan';
import { OtherHealthInsurance } from '@/app/reportOtherHealthInsurance/journeys/OtherHealthInsurance';
import { useAppModalStore } from '@/components/foundation/AppModal';

import '@testing-library/jest-dom';
import { render, RenderResult, screen } from '@testing-library/react';

const mockMemberDetails = {
  member: [
    {
      id: 1,
      dob: '08/06/1959',
    },
  ],
};
const renderUI = () => {
  return render(
    <OtherHealthInsurancePlan
      checkboxState={{
        medicarePlan: false,
        medicalPlan: false,
        dentalPlan: false,
      }}
      onCheckboxChange={() => {}}
      selectedData={true}
    />,
  );
};

const onCheckboxChange = jest.fn();
const handleChange = (checkboxValue: string[]) => {
  onCheckboxChange(checkboxValue);
};

describe('otherPlan', () => {
  const showAppModal = useAppModalStore.getState().showAppModal;
  let component: RenderResult;
  beforeAll(() => {
    component = renderUI();
    showAppModal({
      content: (
        <OtherHealthInsurance memberDetails={mockMemberDetails.member} />
      ),
    });
  });
  it('should render the UI correctly', async () => {
    expect(
      screen.getByText(
        'What type of plan is your other health insurance? Check all that apply:',
      ),
    ).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should call onCheckboxChange with correct values', () => {
    const checkboxValue = ['medicarePlan', 'medicalPlan', 'dentalPlan'];
    handleChange(checkboxValue);
    expect(onCheckboxChange).toHaveBeenCalled();
    expect(onCheckboxChange).toHaveBeenCalledWith(checkboxValue);
    expect(component.baseElement).toMatchSnapshot();
  });
});
