import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { LoginErrorTemplate } from './LoginErrorTemplate';

export const LoginErrorPBETemplate = () => {
  return (
    <LoginErrorTemplate
      label="Loading Error"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Sorry, we can't load this information right now. Please try again later."
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
