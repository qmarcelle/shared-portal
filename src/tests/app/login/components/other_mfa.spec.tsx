import {
  OtherMfaEntry,
  OtherMfaEntryProps,
} from '@/app/(protected)/(common)/member/login/components/OtherMfaEntry';
import { TextBox } from '@/components/foundation/TextBox';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

jest.setTimeout(30000);

const setupUI = ({ authMethod }: OtherMfaEntryProps) => {
  const component = render(<OtherMfaEntry authMethod={authMethod} />);

  const inputSecurityCode = screen.getByRole('textbox', {
    name: /Enter Security Code/i,
  });
  const resendCode = screen.getByRole('button', { name: /Resend Code/i });
  const confirmButton = screen.getByRole('button', { name: /Confirm/i });
  const contactUs = screen.getByRole('button', { name: /contact us/i });
  return {
    component,
    inputSecurityCode,
    resendCode,
    confirmButton,
    contactUs,
  };
};

describe('Authenticator Mfa Component', () => {
  it('should render the UI correctly', () => {
    const ui = setupUI({
      authMethod: '********@somemail.com',
    });
    fireEvent.click(screen.getByRole('button', { name: /Resend Code/i }));
    render(<TextBox text="Code resent!" />);
    expect(ui.inputSecurityCode).toBeVisible();
    expect(ui.confirmButton).toBeVisible();
    expect(ui.contactUs).toBeVisible();
    expect(ui.contactUs).toBeVisible();

    expect(ui.component.container).toMatchSnapshot();
  });
});
