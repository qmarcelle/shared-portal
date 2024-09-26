import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { ToggleSwitch } from '@/components/foundation/ToggleSwitch';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import { useState } from 'react';
import { useSecuritySettingsStore } from '../stores/security_settings_store';
import { ErrorMfaCard } from './ErrorMfaCard';

type DisableMFAWarningProps = {
  enabled: boolean;
};

export const DisableMFAWarning = ({ enabled }: DisableMFAWarningProps) => {
  // TODO: Connect with Store
  const [checked, setChecked] = useState(enabled);
  const { toggleError, toggleMfa } = useSecuritySettingsStore((state) => ({
    mfaEnabled: state.mfaDevicesEnabled,
    toggleMfa: state.toggleMfaDevices,
    toggleError: state.toggleMfaDeviceError,
  }));
  const mfaToggle = (checkedVal: boolean) => {
    const analytics: AnalyticsData = {
      click_text: 'MFA',
      click_url: undefined,
      element_category: 'content interaction',
      action: !checkedVal ? 'on' : 'off',
      event: 'select_content',
      content_type: 'toggle',
    };
    setChecked(!checkedVal);
    toggleMfa();
    googleAnalytics(analytics);
  };
  return (
    <Card type="elevated" className="container">
      <Column className="flex-grow m-4">
        <Row className="items-center justify-between mb-4">
          <p className="body-1 font-bold mt-2">
            MFA is {checked ? 'turned on.' : 'turned off.'}
          </p>
          <ToggleSwitch
            ariaLabel="toggle mfa"
            initChecked={enabled}
            onToggleCallback={() => {
              try {
                mfaToggle(checked);
              } catch (err) {
                useSecuritySettingsStore.setState({
                  toggleMfaDeviceError: true,
                });
              }
            }}
          />
        </Row>
        {checked ? (
          <TextBox
            text="We'll send a one-time security code to your email by default. Set up
            multiple methods for more options when you log in."
          />
        ) : (
          <p className="body-1">
            Turn on MFA to keep your account more secure.
          </p>
        )}
        {toggleError && (
          <ErrorMfaCard
            className="mt-4"
            errorText="We're sorry. We weren't able to update your MFA settings. Please try again later."
          />
        )}
      </Column>
    </Card>
  );
};
