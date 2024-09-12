import { UpdateRowWithStatus } from '@/components/composite/UpdateRowWithStatus';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { DisableMFAWarning } from '../components/DisableMFAWarning';
import { AddMFAAuthenticatorJourney } from '../components/journeys/AddMFAAuthenticatorJourney';
import { AddMFAEmailJourney } from '../components/journeys/AddMFAEmailJourney';
import { AddMFATextJourney } from '../components/journeys/AddMFATextJourney';
import { AddMFAVoiceJourney } from '../components/journeys/AddMFAVoiceJourney';
import { DisableMFAJourney } from '../components/journeys/DisableMFAJourney';
import { MfaDevice } from '../models/mfa_device';
import { MfaDeviceType } from '../models/mfa_device_type';
import { useSecuritySettingsStore } from '../stores/security_settings_store';
import { ErrorMfaCard } from './ErrorMfaCard';

interface MFAInfoComponentProps {
  mfaDevices: Map<MfaDeviceType, MfaDevice>;
}

export const MFAInfoComponent = ({ mfaDevices }: MFAInfoComponentProps) => {
  const { showAppModal } = useAppModalStore();
  const { getDeviceError, mfaDevicesEnabled } = useSecuritySettingsStore();
  const getOnClickContent = (mfa: MfaDevice) => {
    if (mfa.enabled == true) {
      return (
        <DisableMFAJourney
          deviceType={mfa.deviceType}
          emailOrPhone={mfa.emailOrPhone!}
        />
      );
    }
    switch (mfa.deviceType) {
      case MfaDeviceType.authenticator:
        return <AddMFAAuthenticatorJourney />;
      case MfaDeviceType.email:
        return <AddMFAEmailJourney email={mfa.emailOrPhone!} />;
      case MfaDeviceType.text:
        return <AddMFATextJourney initNumber={mfa.emailOrPhone!} />;
      case MfaDeviceType.voice:
        return <AddMFAVoiceJourney initNumber={mfa.emailOrPhone!} />;
    }
  };

  const getEnabledText = (val: MfaDevice) =>
    `Send a security code to ${val.emailOrPhone}.`;

  const authenticator = mfaDevices.get(MfaDeviceType.authenticator)!;

  return (
    <Card className="large-section">
      <div className="flex flex-col">
        <Header type="title-2" text="Multi-Factor Authentication (MFA)" />
        <Spacer size={16} />
        <TextBox
          text="
                Multi-factor authentication (MFA) will confirm your identity when you log in, 
                protecting your important health information."
        />
        <Spacer size={32} />
        {getDeviceError && (
          <ErrorMfaCard
            className="mt-4"
            errorText="We're not able to load your MFA settings right now. Please try again later."
          />
        )}
        {!getDeviceError && (
          <div className="mb-8">
            {/* TODO: Update key during store integration */}
            <DisableMFAWarning
              key={mfaDevicesEnabled ? '1' : '0'}
              enabled={mfaDevicesEnabled}
            />
          </div>
        )}
        {mfaDevicesEnabled && !getDeviceError && (
          <ul>
            <li key={'AuthApp'}>
              <UpdateRowWithStatus
                className="mb-8"
                onClick={() =>
                  showAppModal({
                    content: getOnClickContent(
                      mfaDevices.get(MfaDeviceType.authenticator)!,
                    ),
                  })
                }
                label={
                  <TextBox
                    className="underline underline-offset-4 decoration-dashed app-underline font-bold"
                    text="Authenticator App"
                  />
                }
                enabled={
                  mfaDevices.get(MfaDeviceType.authenticator)?.enabled ?? false
                }
                subLabel={
                  authenticator.enabled ? authenticator.subLabel : undefined
                }
                methodName={
                  mfaDevices.get(MfaDeviceType.authenticator)?.enabled
                    ? 'Remove Method'
                    : 'Set Up Method'
                }
                divider={true}
              />
            </li>
            {[...mfaDevices.entries()].map(([key, val], index) => {
              if (key == MfaDeviceType.authenticator) {
                return null;
              }
              return (
                <li key={val.label}>
                  <UpdateRowWithStatus
                    className="mb-8"
                    onClick={() =>
                      showAppModal({ content: getOnClickContent(val) })
                    }
                    label={<TextBox className="font-bold" text={val.label} />}
                    subLabel={val.enabled ? getEnabledText(val) : undefined}
                    enabled={mfaDevices.get(key)?.enabled ?? false}
                    methodName={
                      mfaDevices.get(key)?.enabled
                        ? 'Remove Method'
                        : 'Set Up Method'
                    }
                    divider={index == 3 ? false : true}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
};
