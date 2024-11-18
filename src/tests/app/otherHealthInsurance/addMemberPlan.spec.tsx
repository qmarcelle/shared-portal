import AddMemberPlan from '@/app/reportOtherHealthInsurance/components/AddMemberPlan';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';

const mockMemberDetails = {
  id: 1,
  dob: '01/27/1931',
};
const renderUI = () => {
  return render(
    <AddMemberPlan
      selectedCheckbox={['medicarePlan']}
      memberDetails={mockMemberDetails}
    />,
  );
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

  test('displays error if entered date match service-provided date', async () => {
    await act(async () => {
      render(
        <AddMemberPlan
          selectedCheckbox={['medicarePlan']}
          memberDetails={mockMemberDetails}
        />,
      );
    });
    // Get input field and enter a mismatched date
    const input = screen.getByLabelText('Policyholder Birth Date (MM/DD/YYYY)');
    await act(async () => {
      fireEvent.change(input, { target: { value: '01/27/1931' } });
    });

    fireEvent.blur(input);

    // Verify error message
    expect(
      screen.queryByText(
        'Your date of birth does not match the information in our system. Please update and try again.',
      ),
    ).not.toBeInTheDocument();
  });

  test('displays error if entered date does not match service-provided date', async () => {
    await act(async () => {
      render(
        <AddMemberPlan
          selectedCheckbox={['medicarePlan']}
          memberDetails={mockMemberDetails}
        />,
      );
    });
    // Get input field and enter a mismatched date
    const input = screen.getByLabelText('Policyholder Birth Date (MM/DD/YYYY)');
    await act(async () => {
      fireEvent.change(input, { target: { value: '10/23/2000' } });
    });

    fireEvent.blur(input);

    // Verify error message
    expect(
      screen.getByText(
        'Your date of birth does not match the information in our system. Please update and try again.',
      ),
    ).toBeInTheDocument();
  });

  test('removes error when the date is cleared', async () => {
    await act(async () => {
      render(
        <AddMemberPlan
          selectedCheckbox={['medicarePlan']}
          memberDetails={mockMemberDetails}
        />,
      );
    });
    const input = screen.getByLabelText('Policyholder Birth Date (MM/DD/YYYY)');
    fireEvent.change(input, { target: { value: '10/23/2000' } });
    fireEvent.blur(input);

    // Error message appears
    expect(
      screen.getByText(
        'Your date of birth does not match the information in our system. Please update and try again.',
      ),
    ).toBeInTheDocument();

    // Clear the input field
    fireEvent.change(input, { target: { value: '' } });

    // Error message should disappear
    expect(
      screen.queryByText(
        'Your date of birth does not match the information in our system. Please update and try again.',
      ),
    ).not.toBeInTheDocument();
  });
});
