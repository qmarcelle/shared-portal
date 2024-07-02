import { ReactElement } from 'react';
import { MfaMode } from '../models/app/mfa_mode';
import { MfaModeState } from '../models/app/mfa_mode_state';
import { AuthenticatorAppMfa } from './AuthenticatorAppMfa';
import { MfaSelection } from './MfaSelection';
import { OtherMfaEntry } from './OtherMfaEntry';
import { useMfaStore } from '../stores/mfaStore';

export const MfaComponent = () => {
  const availMfaOptions = useMfaStore((state) => state.availMfaModes);
  const selectedMfa = useMfaStore((state) => state.selectedMfa);
  const stage = useMfaStore((state) => state.stage);

  function renderMfaItem(): ReactElement {
    switch (selectedMfa!.type) {
      case MfaMode.authenticator:
        return <AuthenticatorAppMfa />;
      case MfaMode.callNum:
      case MfaMode.textNum:
      case MfaMode.email:
      default:
        return <OtherMfaEntry authMethod={selectedMfa!.metadata!.device} />;
    }
  }

  if (stage == MfaModeState.selection) {
    return <MfaSelection mfaOptions={availMfaOptions} />;
  } else if (stage == MfaModeState.code) {
    return renderMfaItem();
  } else {
    throw new Error('Mfa Selection not handled correctly');
  }
};
