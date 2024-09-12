import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { LoginErrorTemplate } from './LoginErrorTemplate';

export const MFASecurityCodeMultipleAttemptComponent = () => {
  return (
    <LoginErrorTemplate
      label="Too Many Login Attempts"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="You have tried the security code too many times. Please wait 10 minutes to try again."
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
