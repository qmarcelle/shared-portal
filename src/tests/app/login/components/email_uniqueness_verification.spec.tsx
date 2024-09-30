import { EmailUniquenessVerification } from '@/app/login/components/EmailUniquenessVerification';
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
  return render(<EmailUniquenessVerification />);
};
describe('Email Unique Verification screen', () => {
  test('Email Unique Verification screen UI', async () => {
    const component = setupUI();

    expect(
      screen.getByRole('heading', { name: 'Choose Your Email Address' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Your email is invalid, or the original email address you provided is already associated with another account. Please provide your date of birth and new email address to continue.',
      ),
    ).toBeVisible();
    //  expect(screen.getByLabelText(/Email Address/i)).toBeVisible();
    expect(screen.getByLabelText(/Confirm Email Address/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /Next/i })).toBeVisible();

    expect(
      screen.getByText(
        'Give us a call using the number listed on the back of your Member ID card or',
      ),
    ).toBeVisible();

    expect(component.baseElement).toMatchSnapshot();
  });

  test('Email Unique Verification screen UI Field Validations', async () => {
    const component = setupUI();
    const dateEntryInput = screen.getByLabelText('Date of Birth (MM/DD/YYYY)');

    //check for invalid date formate
    await userEvent.type(dateEntryInput, '18/11/1970');
    await waitFor(() => {
      expect(
        screen.getByText('Please follow the MM/DD/YYYY format.'),
      ).toBeVisible();
    });
    //check for leap year date
    await userEvent.type(dateEntryInput, '02/29/2023');
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText('Please follow the MM/DD/YYYY format.'),
      ).toBeVisible();
    });

    //check valid email formate
    const emailEntryInput = screen.getByLabelText('Email Address');
    await userEvent.type(emailEntryInput, 'chall123gmail.com');
    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid Email address.'),
      ).toBeVisible();
    });

    //check confirm email address
    const confirmEmailEntryInput = screen.getByLabelText(
      'Confirm Email Address',
    );
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');
    await userEvent.type(confirmEmailEntryInput, 'chall1811@gmail.com');
    await waitFor(() => {
      expect(
        screen.getByText(
          'The email addresses must match. Please check and try again.',
        ),
      ).toBeVisible();
    });

    expect(component.baseElement).toMatchSnapshot();
  });
});
