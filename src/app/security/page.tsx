'use client';

import { LoginInfoComponent } from '../security/components/LoginInfoComponent';
import { MFAInfoComponent } from '../security/components/MFAInfoComponent';

import { useEffect, useRef } from 'react';
import { useSecuritySettingsStore } from './stores/security_settings_store';

const SecurityPage = () => {
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
      <div className="flex flex-col app-content">
        <section className="flex justify-start self-start">
          <h1 className="title-1">Security Settings</h1>
        </section>
        <section className="flex flex-row items-start app-body">
          <LoginInfoComponent username={'akash11!'} />
          <MFAInfoComponent mfaDevices={mfaDevices} />
        </section>
      </div>
    </div>
  );
};

export default SecurityPage;
