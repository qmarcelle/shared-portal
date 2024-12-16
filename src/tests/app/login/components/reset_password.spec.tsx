import { ResetPasswordComponent } from '@/app/login/components/ResetPasswordComponent';
import { PasswordResetResponse } from '@/app/login/models/api/password_reset_response';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
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
jest.setTimeout(30000);
process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';

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
    //Mock the /passwordReset api
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'COMPLETED',
          accessToken: 'ytafbafll-a6b6-fadfd-9b09-36b543aee90f',
          refreshToken:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJzdWIiOiJiZGEwNTA0Ny02NjM1LTQ1Y2ItYjcyZ',
          idToken:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJzdWIiOiJiZGEwNTA0Ny02NjM1LTQ1Y2ItYjcyZ',
          interactionId: '00f39381-a6b6-4eca-9b09-36b543aee90f',
          interactionToken: '96f134d40d9c56e204871e47c88cc53ae4c1',
          sessionToken: '96f134d40d9c56e204871e47c88cc53ae4c1',
          email: 'xyz@xyz.com',
          userId: 'Testuser123',
        },
      } satisfies ESResponse<Partial<PasswordResetResponse>>,
    });
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() => {
      //should see success screen
      expect(screen.getByText(/You've successfully reset your password./i));
    });
    //Should call the /passwordReset api
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication/passwordReset',
      {
        newPassword: 'Xyz@2020',
        dateOfBirth: '2023-02-28',
        interactionId: '',
        interactionToken: '',
        username: '',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
      },
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
