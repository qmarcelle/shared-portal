import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { AppProg } from '../models/app/app_prog';
import { MfaOption } from '../models/app/mfa_option';
import { useMfaStore } from '../stores/mfaStore';

type MfaSelectionProps = {
  mfaOptions: MfaOption[];
};

export const MfaSelection = ({ mfaOptions }: MfaSelectionProps) => {
  const actions = useMfaStore((state) => ({
    updateMfaMode: state.updateMfaMode,
    startMfaAuth: state.startMfaAuth,
  }));
  const selectedMfa = useMfaStore((state) => state.selectedMfa);
  const initMfaProg = useMfaStore((state) => state.initMfaProg);

  return (
    <div id="mainSection">
      <h1>Let&apos;s Confirm Your Identity</h1>
      <p>How would you like to receive your security code?</p>
      {mfaOptions.map((item) => (
        <Radio
          key={item.type}
          label={item.metadata!.selectionText}
          callback={() => actions.updateMfaMode(item)}
          selected={item.type == selectedMfa!.type}
        />
      ))}
      <Spacer size={32} />
      <Button
        callback={() => actions.startMfaAuth()}
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
        />
      </p>
    </div>
  );
};
