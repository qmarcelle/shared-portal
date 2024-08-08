import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextField } from '@/components/foundation/TextField';
import { ToolTip } from '@/components/foundation/Tooltip';
import { AppProg } from '../models/app/app_prog';
import { MfaModeState } from '../models/app/mfa_mode_state';
import { useLoginStore } from '../stores/loginStore';
import { useMfaStore } from '../stores/mfaStore';

export type OtherMfaEntryProps = {
  authMethod: string;
};

export const OtherMfaEntry = ({ authMethod }: OtherMfaEntryProps) => {
  const code = useMfaStore((state) => state.code);
  const completeMfaProg = useMfaStore((state) => state.completeMfaProg);
  const actions = useMfaStore((state) => ({
    submitMfa: state.submitMfaAuth,
    updateCode: state.updateCode,
    resendMfa: state.resendMfa,
    updateMfaStage: state.updateMfaStage,
  }));
  const apiErrors = useLoginStore((state) => state.apiErrors);
  const showTooltip = code.length < 1;

  function validateSecurityCode() {
    if (code.length > 0) {
      return () => actions.submitMfa();
    } else {
      return undefined;
    }
  }

  return (
    <div id="mainSection">
      <h1>Let&apos;s Confirm Your Identity</h1>
      <p>We&apos;ve sent a code to:</p>
      <span aria-label="authentication-method">{authMethod}</span>
      <Spacer size={32} />
      <TextField
        label="Enter Security Code"
        valueCallback={(val) => actions.updateCode(val)}
        errors={apiErrors}
      />
      <Spacer size={24} />
      <AppLink label="Resend Code" callback={() => actions.resendMfa()} />
      <Spacer size={32} />
      <ToolTip
        showTooltip={showTooltip}
        className="flex flex-row justify-center items-center tooltip"
        label="Enter a Security Code."
      >
        <Button
          callback={validateSecurityCode()}
          label={completeMfaProg == AppProg.loading ? 'Confirming' : 'Confirm'}
        />
      </ToolTip>

      <Spacer size={16} />
      <AppLink
        label="Choose a Different Method"
        callback={() => actions.updateMfaStage(MfaModeState.selection)}
        className="m-auto"
      />
      <Spacer size={32} />
      <Divider />
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
        .
      </p>
    </div>
  );
};
