import { AppLink } from '../../../../components/ui/AppLink';
import { Button } from '../../../../components/ui/Button';
import { Divider } from '../../../../components/ui/Divider';
import { Spacer } from '../../../../components/ui/Spacer';
import { AnalyticsData } from '../../../../lib/models/analyticsData';
import { googleAnalytics } from '../../../../lib/utils/analytics';
import { FormEvent } from 'react';
import { AppProg } from '../models/app/app_prog';
import { MfaOption } from '../models/app/mfa_option';
import { useMfaStore } from '../stores/mfaStore';

// These components need to be created or imported from a UI library
const Header = ({ type, text }: { type: string; text: string }) => (
  <h2 className={type === 'title-2' ? 'text-2xl font-bold' : ''}>{text}</h2>
);

const Radio = ({
  label,
  callback,
  selected,
}: {
  label: string;
  callback: () => void;
  selected: boolean;
}) => (
  <div className="flex items-center">
    <input
      type="radio"
      checked={selected}
      onChange={callback}
      className="h-4 w-4 text-blue-600"
    />
    <label className="ml-2 text-sm">{label}</label>
  </div>
);

const TextBox = ({ type, text }: { type: string; text: string }) => (
  <p className={type === 'body-2' ? 'text-sm text-gray-600' : ''}>{text}</p>
);

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

  const sendAuthCode = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
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
    <form onSubmit={(e) => sendAuthCode(e)}>
      <div id="mainSection">
        <Header type="title-2" text="Let's Confirm Your Identity" />
        <Spacer size={16} />
        <p>How would you like to receive your security code?</p>
        <Spacer size={8} />
        {mfaOptions.map((item) => (
          <div key={item.type}>
            <Radio
              label={item.metadata!.selectionText}
              callback={() => updateMfaMode(item)}
              selected={item.type == selectedMfa!.type}
            />
            <Spacer size={8} />
          </div>
        ))}
        <Spacer size={26} />
        <Button
          style="submit"
          callback={sendAuthCode}
          label={
            initMfaProg == AppProg.loading ? 'Sending Code...' : 'Send Code'
          }
        />
        <Spacer size={16} />
        <TextBox
          type="body-2"
          text="
        By sending the code, I agree to receive a one-time message. Message and
        data rates may apply. Subject to terms and condition."
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
    </form>
  );
};