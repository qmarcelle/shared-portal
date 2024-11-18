import { ResetPasswordComponent } from '@/app/login/components/ResetPasswordComponent';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
    };
  },
}));
const setupUI = () => {
  return render(<ResetPasswordComponent />);
};
describe('Reset password screen', () => {
  it('should render UI screen properly', async () => {
    const component = setupUI();

    expect(
      screen.getByRole('heading', { name: 'Reset Your Password' }),
    ).toBeVisible();

    expect(
      screen.getByText(
        /We've updated our security requirements. Please verify your date of birth and reset your password to continue./i,
      ),
    ).toBeVisible();
    const dateEntryInput = screen.getByRole('textbox', {
      name: 'Date of Birth (MM/DD/YYYY)',
    });

    //check for invalid date formate
    await userEvent.type(dateEntryInput, '18111970');
    await waitFor(() => {
      expect(dateEntryInput).toHaveValue('18/11/1970');
      expect(screen.getByText('Please enter a valid date.')).toBeVisible();
    });
    //check for leap year date
    await userEvent.clear(dateEntryInput);
    await userEvent.type(dateEntryInput, '02292023');
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid date.')).toBeVisible();
    });

    const passwordEntryInput = screen.getByLabelText(/New Password/i, {
      selector: 'input',
    });

    //check for invalid date formate
    await userEvent.type(passwordEntryInput, 'xyz@2020');
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid password.')).toBeVisible();
    });

    expect(
      screen.getByText(
        'Enter your date of birth and new password to continue.',
      ),
    ).toBeVisible();
    await userEvent.clear(dateEntryInput);
    await userEvent.clear(passwordEntryInput);
    await userEvent.type(dateEntryInput, '02282023');
    await userEvent.type(passwordEntryInput, 'Xyz@2020');
    await waitFor(() => {
      expect(
        screen.queryByText('Please enter a valid password.'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Please enter a valid date.'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          'Enter your date of birth and new password to continue.',
        ),
      ).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reset Password'));
    expect(screen.getByText(/You've successfully reset your password./i));

    expect(component.baseElement).toMatchSnapshot();
  });
});
