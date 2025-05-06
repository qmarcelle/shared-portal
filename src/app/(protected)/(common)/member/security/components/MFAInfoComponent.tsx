import { DisableMFAWarning } from '@/app/(protected)/(common)/member/security/components/DisableMFAWarning';
import { AddMFAAuthenticatorJourney } from '@/app/(protected)/(common)/member/security/components/journeys/AddMFAAuthenticatorJourney';
import { AddMFAEmailJourney } from '@/app/(protected)/(common)/member/security/components/journeys/AddMFAEmailJourney';
import { AddMFATextJourney } from '@/app/(protected)/(common)/member/security/components/journeys/AddMFATextJourney';
import { AddMFAVoiceJourney } from '@/app/(protected)/(common)/member/security/components/journeys/AddMFAVoiceJourney';
import { DisableMFAJourney } from '@/app/(protected)/(common)/member/security/components/journeys/DisableMFAJourney';
import { MfaDevice } from '@/app/(protected)/(common)/member/security/models/mfa_device';
import {
  MfaDeviceType,
  MfaDeviceTypeAnalytics,
} from '@/app/(protected)/(common)/member/security/models/mfa_device_type';
import { useSecuritySettingsStore } from '@/app/(protected)/(common)/member/security/stores/security_settings_store';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { UpdateRowWithStatus } from '@/components/composite/UpdateRowWithStatus';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { Loader } from '@/components/foundation/Loader';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ToolTip } from '@/components/foundation/Tooltip';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';

interface MFAInfoComponentProps {
  mfaDevices: Map<MfaDeviceType, MfaDevice>;
}

const getMethodName = (enabled: boolean) =>
  enabled ? 'Remove Method' : 'Set Up Method';

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

  const getMFAContentModal = (val: MfaDevice) => {
    const analytics: AnalyticsData = {
      click_text: val?.enabled ? 'remove method' : 'set up method',
      click_url: undefined,
      element_category: MfaDeviceTypeAnalytics[val.deviceType],
      action: val?.enabled ? 'remove method' : 'set up method',
      event: 'select_content',
      content_type: 'select',
    };
    showAppModal({
      content: getOnClickContent(val),
    });
    googleAnalytics(analytics);
  };
  const getEnabledText = (val: MfaDevice) =>
    `Send a security code to ${val.emailOrPhone}.`;

  const authenticator = mfaDevices.get(MfaDeviceType.authenticator)!;
  if (mfaDevicesEnabled === undefined) {
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
          <Loader items={10} />
        </div>
      </Card>
    );
  } else {
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
            <ErrorInfoCard
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
                  onClick={() => {
                    getMFAContentModal(
                      mfaDevices.get(MfaDeviceType.authenticator)!,
                    );
                  }}
                  label={
                    <ToolTip
                      showTooltip={true}
                      className="flex flex-row tooltip"
                      label="An authenticator app is a security application that runs on your mobile device. We recommend using Google Authenticator App, but you can use the app of your choice."
                    >
                      <TextBox
                        className="underline underline-offset-4 decoration-dashed app-underline font-bold"
                        text="Authenticator App"
                        tabFocus={0}
                      />
                    </ToolTip>
                  }
                  enabled={
                    mfaDevices.get(MfaDeviceType.authenticator)?.enabled ??
                    false
                  }
                  subLabel={
                    authenticator.enabled ? authenticator.subLabel : undefined
                  }
                  methodName={getMethodName(authenticator.enabled)}
                  divider={true}
                />
              </li>
              {[...mfaDevices.entries()].map(([deviceType, device], index) => {
                if (deviceType == MfaDeviceType.authenticator) {
                  return null;
                }
                return (
                  <li key={device.label}>
                    <UpdateRowWithStatus
                      className="mb-8"
                      onClick={() => {
                        getMFAContentModal(device);
                      }}
                      label={
                        <TextBox className="font-bold" text={device.label} />
                      }
                      subLabel={
                        device.enabled ? getEnabledText(device) : undefined
                      }
                      enabled={mfaDevices.get(deviceType)?.enabled ?? false}
                      methodName={getMethodName(device.enabled)}
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
  }
};
