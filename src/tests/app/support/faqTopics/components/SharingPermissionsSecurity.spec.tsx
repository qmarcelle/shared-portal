import { FaqTopics } from '@/app/(protected)/(common)/member/support/faqTopics/components/FaqTopics';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<FaqTopics />);
};

describe('Sharing Permissions Security FAQ', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    const sharing = screen.getByRole('button', {
      name: 'Security',
    });

    fireEvent.click(sharing);
    screen.getByText(
      'How to keep your information secure, manage your online account and more.',
    );

    screen.getByRole('heading', {
      name: 'About Multi-factor Authentication',
    });
    screen.getByText('What is multi-factor authentication (MFA)?');
    fireEvent.click(
      screen.getByText('What is multi-factor authentication (MFA)?'),
    );
    screen.getByText(
      'Multi-factor authentication (MFA) is a way to make sure your online accounts are extra safe. It means you need to prove who you are in more than one way before you can log in. Usually, you use your password and then something else, like a code sent to your phone. This makes it much harder for someone else to get into your account.',
    );

    screen.getByRole('heading', {
      name: 'About Email Verification',
    });
    screen.getByText('What is a one-time passcode and how does it work?');
    fireEvent.click(
      screen.getByText('What is a one-time passcode and how does it work?'),
    );
    screen.getByText(
      'A one-time passcode is a security code sent to a user to verify their identity as the owner of their online account. This could be part of the registration process, a forgotten password, enabling multifactor authentication or logging in with MFA.',
    );

    screen.getByRole('heading', {
      name: 'About Account Management',
    });
    screen.getByText('How do I reset my password using a one-time passcode?');
    fireEvent.click(
      screen.getByText('How do I reset my password using a one-time passcode?'),
    );
    screen.getByText(
      'When trying to reset your password the screens will ask you to provide your username and date of birth to verify your identity. Then an email with a one-time security code will be sent to the email address on file for your account. Provide that code with your new password.',
    );

    screen.getByRole('heading', {
      name: 'Other FAQ Topics',
    });
    screen.getByText('Benefits & Coverage');
    screen.getByText('Claims');
    screen.getByText('ID Cards');
    screen.getByText('My Plan Information');
    screen.getByText('Pharmacy');
    screen.getByText('Prior Authorization');
    screen.getByText('Security');

    expect(component).toMatchSnapshot();
  });
});
