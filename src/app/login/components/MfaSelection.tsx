import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import { AppProg } from '../models/app/app_prog';
import { MfaOption } from '../models/app/mfa_option';
import { useMfaStore } from '../stores/mfaStore';

type MfaSelectionProps = {
  mfaOptions: MfaOption[];
};

export const MfaSelection = ({ mfaOptions }: MfaSelectionProps) => {
  const { updateMfaMode, startMfaAuth, selectedMfa, initMfaProg } = useMfaStore(
    (state) => ({
      updateMfaMode: state.updateMfaMode,
      startMfaAuth: state.startMfaAuth,
      selectedMfa: state.selectedMfa,
      initMfaProg: state.initMfaProg,
    }),
  );

  const sendAuthCode = () => {
    const analytics: AnalyticsData = {
      click_text: 'send code',
      click_url: window.location.href,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
    startMfaAuth();
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
      <h1>Let&apos;s Confirm Your Identity</h1>
      <p>How would you like to receive your security code?</p>
      {mfaOptions.map((item) => (
        <Radio
          key={item.type}
          label={item.metadata!.selectionText}
          callback={() => updateMfaMode(item)}
          selected={item.type == selectedMfa!.type}
        />
      ))}
      <Spacer size={32} />
      <Button
        callback={sendAuthCode}
        label={initMfaProg == AppProg.loading ? 'Sending Code...' : 'Send Code'}
      />
      <Spacer size={16} />
      <p className="text-xs">
        By sending the code, I agree to receive a one-time message. Message and
        data rates may apply. Subject to terms and condition.
      </p>
      <Spacer size={16} />
      <h3>Need Help?</h3>
      <p>
        Give us a call using the number listed on the back of your Member ID
        card or{' '}
        <AppLink
          url="https://www.bcbst.com/contact-us"
          label="contact us"
          displayStyle="inline"
          callback={trackContactUsAnalytics}
        />
      </p>
    </div>
  );
};
