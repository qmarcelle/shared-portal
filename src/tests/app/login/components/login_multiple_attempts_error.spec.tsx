import { MultipleAttemptsErrorComponent } from '@/app/login/components/MultipleAttemptsErrorComponent';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const setupUI = () => {
  return render(<MultipleAttemptsErrorComponent />);
};

describe('Multiple Attempts for login error', () => {
  it('should render all the required components', async () => {
    const component = setupUI();

    expect(screen.getByText('Too Many Login Attempts')).toBeVisible();
    expect(
      screen.getByText(
        'You have attempted to log in too many times. Please wait 15 minutes to try again.',
      ),
    ).toBeVisible();

    expect(screen.getByText('Forgot Username/Password?')).toBeVisible();
    expect(screen.getByText('Need help?')).toBeVisible();
    expect(
      screen.getByText(
        'Give us a call using the number listed on the back of your Member ID card or',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
