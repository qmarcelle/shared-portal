import { MFASecurityCodeMultipleAttemptComponent } from '@/app/login/components/MFASecurityCodeMultipleAttemptComponent';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const setupUI = () => {
  return render(<MFASecurityCodeMultipleAttemptComponent />);
};

describe('Multiple Attempts for login error', () => {
  it('should render all the required components', async () => {
    const component = setupUI();

    expect(screen.getByText('Too Many Login Attempts')).toBeVisible();
    expect(
      screen.getByText(
        'You have tried the security code too many times. Please wait 10 minutes to try again.',
      ),
    ).toBeVisible();

    expect(screen.getByText('Need help?')).toBeVisible();
    expect(
      screen.getByText(
        'Give us a call using the number listed on the back of your Member ID card or',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
