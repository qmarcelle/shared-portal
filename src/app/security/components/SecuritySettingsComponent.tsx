'use client';
import { AppPage } from '@/components/foundation/AppPage';
import { Body } from '@/components/foundation/Body';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { useEffect, useRef } from 'react';
import { useSecuritySettingsStore } from '../stores/security_settings_store';
import { LoginInfoComponent } from './LoginInfoComponent';
import { MFAInfoComponent } from './MFAInfoComponent';

interface SecuritySettingsProps {
  username: string;
  isImpersonated?: boolean;
}

export const SecuritySettings = ({
  username,
  isImpersonated = false,
}: SecuritySettingsProps) => {
  const { mfaDevices, loadMfaDevices } = useSecuritySettingsStore();

  const initialized = useRef(false);
  useEffect(() => {
    (async () => {
      if (!initialized.current) {
        initialized.current = true;
        try {
          await loadMfaDevices();
        } catch (err) {
          console.log('Error occured when loading MFA Devices');
        }
      }
    })();
  });
  return (
    <AppPage>
      <Body>
        <Header type="title-1" text="Security Settings" />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <LoginInfoComponent
              username={username}
              isImpersonated={!isImpersonated}
            />
            {/* Commenting out for 10/16 release. 
            To Do: Enable it for 12/16 release
            <IdentityProtectionServiceCard />*/}
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            <MFAInfoComponent
              mfaDevices={mfaDevices}
              allowUpdates={!isImpersonated}
            />
          </Column>
        </section>
      </Body>
    </AppPage>
  );
};
