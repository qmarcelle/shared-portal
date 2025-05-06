import { AuthenticatorAppMfa } from '@/app/(protected)/(common)/member/login/components/AuthenticatorAppMfa';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.setTimeout(30000);

const setupUI = () => {
  const component = render(<AuthenticatorAppMfa />);

  const inputSecurityCode = screen.getByRole('textbox', {
    name: /Enter Security Code/i,
  });
  const confirmButton = screen.getByRole('button', { name: /Confirm/i });
  const chooseDiffrentMethod = screen.getByRole('button', {
    name: /Choose a Different Method/i,
  });
  const contactUs = screen.getByRole('button', { name: /contact us/i });
  return {
    component,
    inputSecurityCode,
    confirmButton,
    chooseDiffrentMethod,
    contactUs,
  };
};

describe('Authenticator Mfa Component', () => {
  it('should render the UI correctly', () => {
    const ui = setupUI();

    expect(ui.inputSecurityCode).toBeVisible();
    expect(ui.confirmButton).toBeVisible();
    expect(ui.chooseDiffrentMethod).toBeVisible();
    expect(ui.contactUs).toBeVisible();
    expect(ui.contactUs).toBeVisible();

    expect(ui.component.container).toMatchSnapshot();
  });
});
