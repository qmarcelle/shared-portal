import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { QRCodeGenerator } from '@/components/foundation/QRCodeGenerator';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { AppProg } from '@/models/app_prog';
import { ComponentDetails } from '@/models/component_details';
import { useEffect, useRef, useState } from 'react';
import { MfaDeviceType } from '../../models/mfa_device_type';
import { VerifyMfaResponse } from '../../models/verify_mfa_devices';
import { useSecuritySettingsStore } from '../../stores/security_settings_store';

export const AddMFAAuthenticatorJourney = ({
  changePage,
  pageIndex,
}: ModalChildProps) => {
  const {
    updateMfaDevice,
    verifyMfaDevice,
    verifyMfaResult,
    updatedMfaResult,
    resetVerifyMfaError,
  } = useSecuritySettingsStore();
  const [confirmCode, setConfirmCode] = useState('');
  const { dismissModal } = useAppModalStore();

  const initialized = useRef(false);
  useEffect(() => {
    (async () => {
      if (!initialized.current) {
        initialized.current = true;
        try {
          await updateMfaDevice(MfaDeviceType.authenticator);
        } catch (err) {
          // Change to Error page
          changePage!(2, false);
        }
      }
    })();
  });

  const submitCode = async () => {
    try {
      // Do API call for submit code
      const response: ComponentDetails<VerifyMfaResponse> | undefined =
        await verifyMfaDevice(MfaDeviceType.authenticator, confirmCode);
      if (response?.state == AppProg.success) {
        changePage?.(1, false);
      }
    } catch (err) {
      // Change to Error page
      changePage!(2, false);
    }
  };

  const updateSecurityCode = (value: string) => {
    setConfirmCode(value);
    if (verifyMfaResult?.errors.length) {
      resetVerifyMfaError();
    }
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Authenticator App Setup"
      subLabel="Scan the QR Code or manually type the secret key into your authenticator app then enter the security code."
      actionArea={
        <Column className="items-center">
          <div style={{ minWidth: 132, height: 132 }}>
            <QRCodeGenerator value={updatedMfaResult?.result?.keyUri ?? ''} />
          </div>
          <Spacer size={24} />
          <TextBox className="body-1 font-bold" text={'Secret Key:'} />
          <Spacer size={8} />
          <TextBox
            text={updatedMfaResult?.result?.secret ?? ''}
            type="body-1"
          />
          <Spacer size={24} />
          <Divider />
          <Spacer size={24} />
          <TextField
            valueCallback={(val) => updateSecurityCode(val)}
            label={'Enter Security Code'}
            errors={verifyMfaResult?.errors}
          ></TextField>
          <Spacer size={24} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={confirmCode.length > 5 ? () => submitCode() : undefined}
    />,

    <SuccessSlide
      key={1}
      label="Authenticator App Setup Complete"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="The next time you login, you'll generate a code through your authenticator app."
          />
          <Spacer size={32} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
    <ErrorDisplaySlide
      key={2}
      label="Try Again Later"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Oops! We're sorry. Something went wrong. Please try again."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
