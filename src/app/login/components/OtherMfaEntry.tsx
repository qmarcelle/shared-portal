import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { ToolTip } from '@/components/foundation/Tooltip';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import { AppProg } from '../models/app/app_prog';
import {
  INVALID_CODE_LENGTH,
  MIN_CODE_LENGTH,
} from '../models/app/login_constants';
import { MfaModeState } from '../models/app/mfa_mode_state';
import { useLoginStore } from '../stores/loginStore';
import { useMfaStore } from '../stores/mfaStore';

export type OtherMfaEntryProps = {
  authMethod: string;
};

export const OtherMfaEntry = ({ authMethod }: OtherMfaEntryProps) => {
  const {
    code,
    resend,
    completeMfaProg,
    submitMfaAuth,
    updateCode,
    resendMfa,
    updateMfaStage,
    availMfaModes,
  } = useMfaStore((state) => ({
    code: state.code,
    resend: state.resend,
    completeMfaProg: state.completeMfaProg,
    submitMfaAuth: state.submitMfaAuth,
    updateCode: state.updateCode,
    resendMfa: state.resendMfa,
    updateMfaStage: state.updateMfaStage,
    availMfaModes: state.availMfaModes,
  }));
  const { resetApiErrors, apiErrors } = useLoginStore();
  const showTooltip = code.length < MIN_CODE_LENGTH;

  function validateSecurityCode() {
    const analytics: AnalyticsData = {
      click_text: 'confirm',
      click_url: process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL,
      element_category: 'login',
      action: undefined,
      event: 'login',
      content_type: undefined,
    };

    if (code.length > INVALID_CODE_LENGTH) {
      return () => {
        submitMfaAuth();
        googleAnalytics(analytics);
      };
    }
    return undefined;
  }

  const updateSecurityCode = (value: string) => {
    updateCode(value);
    if (apiErrors.length) {
      resetApiErrors();
    }
  };

  const updateCodeResentText = () => {
    const analytics: AnalyticsData = {
      click_text: 'resend code',
      click_url: undefined,
      element_category: 'content interaction',
      action: 'select',
      event: 'select_content',
      content_type: 'select',
    };
    googleAnalytics(analytics);
    resendMfa();
  };

  const chooseDifferentMfaMethod = () => {
    const analytics: AnalyticsData = {
      click_text: 'choose a different method',
      click_url: window.location.href,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
    updateMfaStage(MfaModeState.selection);
  };

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

  return (
    <section id="mainSection">
      <TextBox type="title-2" text="Let's Confirm Your Identity" />
      <Spacer size={16} />
      <p>We&apos;ve sent a code to:</p>
      <span aria-label="authentication-method">{authMethod}</span>
      <Spacer size={32} />
      <TextField
        label="Enter Security Code"
        valueCallback={(val) => updateSecurityCode(val)}
        errors={apiErrors}
      />
      <Spacer size={24} />
      {resend && <TextBox className="text-lime-700" text="Code resent!" />}
      {!resend && (
        <AppLink
          className="self-start"
          callback={() => updateCodeResentText()}
          label="Resend Code"
        />
      )}
      <Spacer size={32} />
      <ToolTip
        showTooltip={showTooltip}
        className="flex flex-row justify-center items-center tooltip"
        label="Enter a Security Code."
      >
        <Button
          callback={validateSecurityCode()}
          label={
            completeMfaProg == AppProg.loading ||
            completeMfaProg == AppProg.success
              ? 'Confirming'
              : 'Confirm'
          }
        />
      </ToolTip>

      <Spacer size={16} />
      {availMfaModes.length > 1 && (
        <AppLink
          label="Choose a Different Method"
          callback={chooseDifferentMfaMethod}
          className="m-auto"
        />
      )}
      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />
      <h3>Need Help?</h3>
      <Spacer size={8} />
      <p>
        Give us a call using the number listed on the back of your Member ID
        card or{' '}
        <AppLink
          className="pl-0 pt-0 pr-0"
          url="https://www.bcbst.com/contact-us"
          label="contact us"
          displayStyle="inline"
          callback={trackContactUsAnalytics}
        />
        .
      </p>
    </section>
  );
};
