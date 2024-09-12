import { LoginEmailVerification } from '@/app/login/components/LoginEmailVerification';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<LoginEmailVerification />);
};

describe('Login Email Verfication Component', () => {
  it('should render UI correctly', () => {
    const component = renderUI();
    // eslint-disable-next-line quotes
    screen.getByRole('heading', { name: "Let's Verify Your Email" });
    screen.getByText(
      'We’ll need to confirm your email address before you can log in.',
    );
    screen.getByText('We’ve sent a code to:');
    screen.getByText('Enter the security code to verify your email address.');
    expect(
      screen.getByRole('textbox', {
        name: /Enter Security Code/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', {
        name: /Confirm Code/i,
      }),
    ).toBeVisible();
    screen.getByText('Don’t see your confirmation email?');
    screen.getByText(
      'Be sure to check your spam or junk folders. You can also give us a call using the number listed on the back of your Member ID card or',
    );
    expect(
      screen.getByRole('button', {
        name: /contact us/i,
      }),
    ).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
