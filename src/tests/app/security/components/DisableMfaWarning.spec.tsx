import { DisableMFAWarning } from '@/app/security/components/DisableMFAWarning';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('DisableMFAWarning', () => {
  it('should render ui correctly for enabled mfa', () => {
    const { container } = render(<DisableMFAWarning enabled={true} />);
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "We'll send a one-time security code to your email by default. Set up multiple methods for more options when you log in.",
      ),
    ).toBeVisible();

    expect(container).toMatchSnapshot();
  });

  it('should render ui correctly for disabled mfa', () => {
    const { container } = render(<DisableMFAWarning enabled={false} />);
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        'Turn on MFA to keep your account more secure.',
      ),
    ).toBeVisible();

    expect(container).toMatchSnapshot();
  });

  it('should render ui correctly on toggle', () => {
    render(<DisableMFAWarning enabled={false} />);
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        'Turn on MFA to keep your account more secure.',
      ),
    ).toBeVisible();

    const toggleSwitch = screen.getByLabelText('toggle mfa');
    fireEvent.click(toggleSwitch);

    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "We'll send a one-time security code to your email by default. Set up multiple methods for more options when you log in.",
      ),
    ).toBeVisible();
  });
});
