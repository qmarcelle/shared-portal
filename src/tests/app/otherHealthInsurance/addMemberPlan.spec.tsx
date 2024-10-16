import AddMemberPlan from '@/app/reportOtherHealthInsurance/components/AddMemberPlan';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<AddMemberPlan selectedCheckbox={['medicarePlan']} />);
};

describe('AddMemberPlan', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Add Medicare Plan' });

    expect(
      screen.getByText(
        'Tell us about your other insurance. All fields are required unless noted as optional.',
      ),
    ).toBeInTheDocument();

    const companyName = screen.getByLabelText('Company Name');
    expect(companyName).toBeInTheDocument();
    expect(
      screen.getByLabelText('Policy Identification Number'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Company Phone Number')).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
