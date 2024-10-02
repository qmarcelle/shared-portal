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
import { MIN_CODE_LENGTH } from '../models/app/login_constants';
import { MfaModeState } from '../models/app/mfa_mode_state';
import { useLoginStore } from '../stores/loginStore';
import { useMfaStore } from '../stores/mfaStore';

export const AuthenticatorAppMfa = () => {
  const { code, completeMfaProg, submitMfaAuth, updateCode, updateMfaStage } =
    useMfaStore((state) => ({
      code: state.code,
      completeMfaProg: state.completeMfaProg,
      submitMfaAuth: state.submitMfaAuth,
      updateCode: state.updateCode,

      updateMfaStage: state.updateMfaStage,
    }));
  const { resetApiErrors, apiErrors } = useLoginStore();
  const showTooltip = code.length < MIN_CODE_LENGTH;

  function getSubmitMfaFunction() {
    if (code.length > 0) {
      return () => submitMfaAuth();
    } else {
      return undefined;
    }
  }
  const updateSecurityCode = (value: string) => {
    updateCode(value);
    if (apiErrors.length) {
      resetApiErrors();
    }
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
    <div id="mainSection">
      <TextBox type="title-2" text="Let's Confirm Your Identity" />
      <Spacer size={16} />
      <p>Enter the security code from your authenticator app.</p>
      <Spacer size={32} />
      <TextField
        label="Enter Security Code"
        valueCallback={(val) => updateSecurityCode(val)}
        errors={apiErrors}
      />
      <Spacer size={32} />
      <ToolTip
        showTooltip={showTooltip}
        className="flex flex-row justify-center items-center tooltip"
        label="Enter a Security Code."
      >
        <Button
          callback={getSubmitMfaFunction()}
          label={
            completeMfaProg == AppProg.loading ||
            completeMfaProg == AppProg.success
              ? 'Confirming'
              : 'Confirm'
          }
        />
      </ToolTip>
      <Spacer size={16} />
      <AppLink
        label="Choose a Different Method"
        callback={() => updateMfaStage(MfaModeState.selection)}
        className="m-auto"
      />
      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />
      <h3>Need Help?</h3>
      <p>
        Give us a call using the number listed on the back of your Member ID
        card or{' '}
        <AppLink
          className="pl-0 pt-0"
          url="https://www.bcbst.com/contact-us"
          label="contact us"
          displayStyle="inline"
          callback={trackContactUsAnalytics}
        />
      </p>
    </div>
  );
};
