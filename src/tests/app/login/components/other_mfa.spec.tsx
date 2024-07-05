import {
  OtherMfaEntry,
  OtherMfaEntryProps,
} from '@/app/login/components/OtherMfaEntry';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.setTimeout(30000);

const setupUI = ({ authMethod }: OtherMfaEntryProps) => {
  const component = render(<OtherMfaEntry authMethod={authMethod} />);

  const inputSecurityCode = screen.getByRole('textbox', {
    name: /Enter Security Code/i,
  });
  const resendCode = screen.getByRole('button', { name: /Resend Code/i });
  const confirmButton = screen.getByRole('button', { name: /Confirm/i });
  const chooseDiffrentMethod = screen.getByRole('button', {
    name: /Choose a Different Method/i,
  });
  const contactUs = screen.getByRole('button', { name: /contact us/i });
  return {
    component,
    inputSecurityCode,
    resendCode,
    confirmButton,
    chooseDiffrentMethod,
    contactUs,
  };
};

describe('Authenticator Mfa Component', () => {
  it('should render the UI correctly', () => {
    const ui = setupUI({
      authMethod: '********@somemail.com',
    });

    expect(ui.inputSecurityCode).toBeVisible();
    expect(ui.confirmButton).toBeVisible();
    expect(ui.chooseDiffrentMethod).toBeVisible();
    expect(ui.contactUs).toBeVisible();
    expect(ui.contactUs).toBeVisible();

    expect(ui.component.container).toMatchSnapshot();
  });
});
