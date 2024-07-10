'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { useEffect, useRef } from 'react';
import { useLoginStore } from '../login/stores/loginStore';
import { LoginInfoComponent } from '../security/components/LoginInfoComponent';
import { MFAInfoComponent } from '../security/components/MFAInfoComponent';
import { IdentityProtectionService } from './components/IdentityProtectionService';
import { useSecuritySettingsStore } from './stores/security_settings_store';

const SecurityPage = () => {
  const { mfaDevices, loadMfaDevices } = useSecuritySettingsStore();
  const { username } = useLoginStore();

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
        <Spacer size={32} />
        <Header className="pl-3" type="title-1" text="Security Settings" />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <LoginInfoComponent username={username} />
            <IdentityProtectionService />
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            <MFAInfoComponent mfaDevices={mfaDevices} />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default SecurityPage;
