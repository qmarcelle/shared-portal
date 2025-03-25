import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { LoginErrorTemplate } from './LoginErrorTemplate';

export const MultipleAttemptsErrorComponent = () => {
  return (
    <LoginErrorTemplate
      label="Too Many Login Attempts"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="You have attempted to log in too many times. Please wait 15 minutes to try again."
          />
          <Spacer size={32} />
          <AppLink
            className="self-start"
            label="Forgot Username/Password?"
            url={process.env.NEXT_PUBLIC_PASSWORD_RESET}
          />
          <Spacer size={32} />
          <Divider />
          <Spacer size={32} />
          <TextBox className="title-3 center" text="Need help?" />
          <Spacer size={16} />
        </Column>
      }
      bottomNote="Give us a call using the number listed on the back of your Member ID card or "
      contactUs="contact us."
    />
  );
};
