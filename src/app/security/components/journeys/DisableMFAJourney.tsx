import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InitModalSlide } from '@/components/composite/InitModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { MfaDeviceType } from '../../models/mfa_device_type';
import { useSecuritySettingsStore } from '../../stores/security_settings_store';
const headerText = 'Turn Off Method';

export interface DisableMFAJourneyProps {
  deviceType: MfaDeviceType;
  emailOrPhone: string;
}

export const DisableMFAJourney = ({
  changePage,
  pageIndex,
  deviceType,
  emailOrPhone,
}: ModalChildProps & DisableMFAJourneyProps) => {
  const { deleteMfaDevice } = useSecuritySettingsStore();
  const { dismissModal } = useAppModalStore();

  const callDeleteMfaDevice = async () => {
    try {
      await deleteMfaDevice(deviceType, emailOrPhone);
      // Do API call for turn off method
      changePage?.(1, false);
    } catch (err) {
      changePage!(2, false);
    }
  };

  const pages = [
    <InitModalSlide
      key={0}
      label={headerText}
      buttonLabel="Turn Off Method"
      subLabel={
        <Column>
          <TextBox
            className="body-1 text-center"
            text={
              'Are you sure you want to turn off the ' +
              `${deviceType}` +
              ' method of mutli-factor authentication?'
            }
          />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={callDeleteMfaDevice}
    />,
    <SuccessSlide
      key={1}
      label="Authentication Method Turned Off"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text={
              // eslint-disable-next-line quotes
              `You've Successfully turned off the ${deviceType} method of multi-factor authentication.`
            }
          />
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
