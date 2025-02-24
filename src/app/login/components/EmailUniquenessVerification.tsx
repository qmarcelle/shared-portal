import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { ToolTip } from '@/components/foundation/Tooltip';
import { FormEvent } from 'react';
import { useEmailUniquenessStore } from '../stores/emailUniquenessStore';

export const EmailUniquenessVerification = () => {
  const [
    emailAddress,
    confirmEmailAddress,
    invalidEmailError,
    invalidConfirmEmailError,
    isApiError,
    updateEmail,
    updateEmailAddress,
    updateConfirmEmailAddress,
  ] = useEmailUniquenessStore((state) => [
    state.emailAddress,
    state.confirmEmailAddress,
    state.invalidEmailError,
    state.invalidConfirmEmailError,
    state.isApiError,
    state.updateEmail,
    state.updateEmailAddress,
    state.updateConfirmEmailAddress,
  ]);

  const enableNext = (): boolean => {
    return (
      emailAddress.length > 0 &&
      confirmEmailAddress.length > 0 &&
      !invalidEmailError.length &&
      !invalidConfirmEmailError.length
    );
  };

  const onUpdateEmail = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    updateEmail();
  };

  return (
    <form
      onSubmit={(e) => {
        enableNext() ? onUpdateEmail(e) : undefined;
      }}
    >
      <section id="mainSection">
        <Header className="title-2" text="Update Your Email Address"></Header>
        <Spacer size={16} />
        <TextBox
          ariaLabel="You need to change your email, or the email was already associated with another account. Please enter a new email address below."
          text="You need to change your email, or the email was already associated with another account. Please enter a new email address below."
        />
        <Spacer size={32} />
        <TextField
          ariaLabel="Email Address"
          label="Email Address"
          valueCallback={(val) => updateEmailAddress(val)}
          type="email"
          errors={invalidEmailError}
          value={emailAddress}
        ></TextField>
        <Spacer size={32} />
        <TextField
          ariaLabel="Confirm Email Address"
          label="Confirm Email Address"
          type="email"
          value={confirmEmailAddress}
          valueCallback={(val) => updateConfirmEmailAddress(val)}
          errors={invalidConfirmEmailError}
          highlightError={!isApiError}
        ></TextField>
        <Spacer size={32} />
        <ToolTip
          showTooltip={!enableNext()}
          className="flex flex-row justify-center items-center tooltip"
          label="Fill out the form to continue."
        >
          <Button
            callback={enableNext() ? onUpdateEmail : undefined}
            style="submit"
            label="Next"
          />
        </ToolTip>

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
              Give us a call using the number listed on the back of your Member
              ID card or{' '}
            </span>,
            <span className="link" key={1}>
              <a href={process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL ?? ''}>
                contact us
              </a>
            </span>,
          ]}
        />
      </section>
    </form>
  );
};
