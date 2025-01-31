import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { ToolTip } from '@/components/foundation/Tooltip';
import { AnalyticsData } from '@/models/app/analyticsData';
import { AppProg } from '@/models/app_prog';
import { googleAnalytics } from '@/utils/analytics';
import { maskEmail } from '@/utils/mask_utils';
import {
  INVALID_CODE_LENGTH,
  MIN_CODE_LENGTH,
} from '../models/app/login_constants';
import { LoginEmailVerificationText } from '../models/app/verify_text';
import { useLoginStore } from '../stores/loginStore';
import { useVerifyEmailStore } from '../stores/verifyEmailStore';

export const LoginEmailVerification = () => {
  const { emailId, inactive } = useLoginStore();
  const {
    resetApiErrors,
    updateCode,
    apiErrors,
    code,
    completeVerifyEmailProg,
    submitVerifyEmailAuth,
  } = useVerifyEmailStore((state) => ({
    resetApiErrors: state.resetApiErrors,
    updateCode: state.updateCode,
    apiErrors: state.apiErrors,
    code: state.code,
    completeVerifyEmailProg: state.completeVerifyEmailProg,
    submitVerifyEmailAuth: state.submitVerifyEmailAuth,
  }));
  const updateSecurityCode = (value: string) => {
    updateCode(value);
    if (apiErrors.length) {
      resetApiErrors();
    }
  };
  const validateSecurityCode = () =>
    code.length > INVALID_CODE_LENGTH ? submitVerifyEmailAuth : undefined;
  const showTooltip = code.length < MIN_CODE_LENGTH;

  const trackContactUsAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'contact us',
      click_url: process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
  };

  const interfaceText: LoginEmailVerificationText = inactive
    ? {
        title: 'Welcome Back!',
        line1:
          'It looks like it has been a while since you logged in to your account. For security purposes, we’ve sent a code to:',
        lowerTitle: 'Need help?',
        lowerText:
          'Give us a call using the number listed on the back of your Member ID card or',
      }
    : {
        title: 'Let’s Verify Your Email',
        line1:
          'We’ll need to confirm your email address before you can log in.',
        line2: 'We’ve sent a code to:',
        line3: 'Enter the security code to verify your email address.',
        lowerTitle: 'Don’t see your confirmation email?',
        lowerText:
          'Be sure to check your spam or junk folders. You can also give us a call using the number listed on the back of your Member ID card or',
      };

  return (
    <form onSubmit={validateSecurityCode()}>
      <div id="mainSection">
        <Header text={interfaceText.title} />
        <Spacer size={16} />
        <TextBox text={interfaceText.line1} />
        {interfaceText.line2 && <Spacer size={16} />}
        {interfaceText.line2 && <TextBox text={interfaceText.line2} />}
        <TextBox
          text={emailId ? maskEmail(emailId) : ''}
          className="font-bold"
        />
        {interfaceText.line3 && <Spacer size={16} />}
        {interfaceText.line3 && <TextBox text={interfaceText.line3} />}
        <Spacer size={32} />
        <TextField
          label="Enter Security Code"
          valueCallback={(val) => updateSecurityCode(val)}
          errors={apiErrors}
        />
        <Spacer size={16} />
        <ToolTip
          showTooltip={showTooltip}
          className="flex flex-row justify-center items-center tooltip"
          label="Enter a Security Code."
        >
          <Button
            style="submit"
            callback={validateSecurityCode()}
            label={
              completeVerifyEmailProg == AppProg.loading
                ? 'Confirming...'
                : 'Confirm Code'
            }
          />
        </ToolTip>
        <Spacer size={32} />
        <Divider />
        <Spacer size={16} />
        <Header text={interfaceText.lowerTitle} type="title-3" />
        <Spacer size={16} />
        <TextBox
          className="pr-1"
          text={interfaceText.lowerText}
          display="inline"
        />
        <AppLink
          className="p-0"
          url="https://www.bcbst.com/contact-us"
          label="contact us"
          displayStyle="inline"
          callback={trackContactUsAnalytics}
        />
        <TextBox text="." display="inline" />
      </div>
    </form>
  );
};
