import SelectMemberPlan from '@/app/(protected)/(common)/member/reportOtherHealthInsurance/components/SelectMemberPlan';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<SelectMemberPlan selectedCheckbox={['medicarePlan']} />);
};

describe('selectMemberPlan', () => {
  const component = renderUI();
  it('should render the UI correctly', async () => {
    screen.getByRole('heading', { name: 'Add Medicare Plan' });

    expect(screen.getByText(/The policy you've entered is:/i)).toBeVisible();
    const companyName = screen.getAllByText(/[Company Name]/i);
    expect(companyName[0]).toBeVisible();

    expect(
      screen.getByText(
        'Do other members of your plan have this other health insurance policy?',
      ),
    ).toBeVisible();
  });

  it('should show checkboxes when select members option selected', async () => {
    render(<SelectMemberPlan selectedCheckbox={['medicarePlan']} />);
    const selectMembers = screen.getByLabelText(/Select Members/i);
    expect(selectMembers).toBeChecked();
    expect(screen.getByLabelText('Chris Hall')).toBeInTheDocument();
  });

  it('should hide checkboxes when Apply to All Members option selected', async () => {
    render(<SelectMemberPlan selectedCheckbox={['medicarePlan']} />);
    const allMembers = screen.getByLabelText(/Apply to All Members/i);
    fireEvent.click(allMembers);
    const checkBox1 = screen.queryByLabelText('Chris Hall');
    expect(checkBox1).not.toBeInTheDocument();
  });

  expect(component).toMatchSnapshot();
});
