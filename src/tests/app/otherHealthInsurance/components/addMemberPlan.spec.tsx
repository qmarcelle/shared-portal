import AddMemberPlan from '@/app/(protected)/(common)/member/reportOtherHealthInsurance/components/AddMemberPlan';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';

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
    <AddMemberPlan
      selectedCheckbox={['medicarePlan']}
      memberDetails={mockMemberDetails.member}
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
          memberDetails={mockMemberDetails.member}
        />,
      );
    });
    // Get input field and enter a mismatched date
    const input = screen.getByLabelText('Policyholder Birth Date (MM/DD/YYYY)');
    await act(async () => {
      fireEvent.change(input, { target: { value: '08/06/1959' } });
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
          memberDetails={mockMemberDetails.member}
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
          memberDetails={mockMemberDetails.member}
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
