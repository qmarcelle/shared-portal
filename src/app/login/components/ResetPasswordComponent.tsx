import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

export const ResetPasswordComponent = () => {
  return (
    <section id="mainSection">
      <Header className="title-2" text="Reset Your Password"></Header>
      <Spacer size={16} />
      <TextBox
        ariaLabel="We've updated our security requirements. Please reset your password to continue."
        text="We've updated our security requirements. Please reset your password to continue."
      />
      <Spacer size={32} />
      <Button
        label="Go to Password Reset"
        callback={() => {
          window.location.href = process.env.NEXT_PUBLIC_PASSWORD_RESET ?? '';
        }}
      />
      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />

      <TextBox
        ariaLabel="Need Help?"
        className="title-3"
        text="Need help?"
      ></TextBox>
      <Spacer size={16} />
      <RichText
        spans={[
          <span key={0}>
            Give us a call using the number listed on the back of your Member ID
            card or{' '}
          </span>,
          <span className="link" key={1}>
            <a href={process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL ?? ''}>
              contact us
            </a>
          </span>,
        ]}
      />
    </section>
  );
};
