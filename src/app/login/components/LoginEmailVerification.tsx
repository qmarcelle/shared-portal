import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';

export const LoginEmailVerification = () => {
  return (
    <div id="mainSection">
      <Header text="Let's Confirm Your Identity" />
      <Spacer size={16} />
      <TextBox text="We’ll need to confirm your email address before you can log in." />
      <Spacer size={16} />
      <TextBox text="We’ve sent a code to:" />
      <TextBox text={'ch****@gmail.com'} className="font-bold" />
      <Spacer size={16} />
      <TextBox text="Enter the security code to verify your email address." />
      <Spacer size={32} />
      <TextField label="Enter Security Code" />
      <Spacer size={16} />
      <Button label="Confirm Code" />
      <Spacer size={32} />
      <Divider />
      <Spacer size={16} />
      <Header text="Don’t see your confirmation email?" type="title-3" />
      <Spacer size={16} />
      <TextBox
        className="pr-5"
        text="Be sure to check your spam or junk folders. You can also give us a call using the number listed on the back of your Member ID card or"
      />
      <section className="flex flex-row">
        <AppLink
          className="p-0"
          url="https://www.bcbst.com/contact-us"
          label="contact us"
          displayStyle="inline"
        />
        <TextBox text="." />
      </section>
    </div>
  );
};
