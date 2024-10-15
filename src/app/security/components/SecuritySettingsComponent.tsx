'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { useEffect, useRef } from 'react';
import { useSecuritySettingsStore } from '../stores/security_settings_store';
import { LoginInfoComponent } from './LoginInfoComponent';
import { MFAInfoComponent } from './MFAInfoComponent';

interface SecuritySettingsProps {
  username: string;
}

export const SecuritySettings = ({ username }: SecuritySettingsProps) => {
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
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header type="title-1" text="Security Settings" />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <LoginInfoComponent username={username} />
            {/* Commenting out for 10/16 release. 
            To Do: Enable it for 12/16 release
            <IdentityProtectionServiceCard />*/}
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            <MFAInfoComponent mfaDevices={mfaDevices} />
          </Column>
        </section>
      </Column>
    </div>
  );
};
