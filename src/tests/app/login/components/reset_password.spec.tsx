import { ResetPasswordComponent } from '@/app/login/components/ResetPasswordComponent';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
  test('shoul render UI screen properly', async () => {
    const component = setupUI();

    expect(
      screen.getByRole('heading', { name: 'Reset Your Password' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "We've updated our security requirements. Please reset your password to continue.",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: /Go to Password Reset/i }),
    ).toBeVisible();

    expect(
      screen.getByText(
        'Give us a call using the number listed on the back of your Member ID card or',
      ),
    ).toBeVisible();

    expect(component.baseElement).toMatchSnapshot();
  });
});
