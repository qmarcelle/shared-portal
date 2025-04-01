import { ConfirmTermsSlide } from '@/components/composite/ConfirmTermsSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { saveDataAction } from '../actions/communicationSettingsAction';

interface UpdateCommunicationTermsProps {
  selectedPreferences: {
    memberKey: string | undefined;
    subscriberKey: string | undefined;
    emailAddress: string;
    mobileNumber: string;
    groupKey: string;
    lineOfBusiness: string;
    contactPreference: {
      optOut: string;
      communicationCategory: string;
      communicationMethod: string;
    }[];
    dutyToWarn: string[];
  };
}

export const UpdateCommunicationTerms = ({
  changePage,
  pageIndex,
  selectedPreferences,
}: ModalChildProps & UpdateCommunicationTermsProps) => {
  const { dismissModal } = useAppModalStore();

  const handleNext = async () => {
    try {
      console.log('selectedPreferences', selectedPreferences);
      const response = await saveDataAction(selectedPreferences);

      if (response.details?.componentStatus === 'Success') {
        changePage?.(1, true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const pages = [
    <ConfirmTermsSlide
      key={0}
      label="Confirm Changes"
      subLabel="Agree to the terms below and change your contact preferences."
      linkLabel="Cancel"
      checkboxLabel={selectedPreferences.dutyToWarn
        .join('')
        .replaceAll('&apos;', '′')}
      cancelCallback={() => dismissModal()}
      nextCallback={handleNext}
    />,
    <SuccessSlide
      key={1}
      label="Alert Preference Saved"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Your communication preferences have been updated."
          />
          <Spacer size={16} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
