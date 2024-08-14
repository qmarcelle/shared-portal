import { ConfirmTermsSlide } from '@/components/composite/ConfirmTermsSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface UpdateCommunicationTermsProps {}

export const UpdateCommunicationTerms = ({
  changePage,
  pageIndex,
}: ModalChildProps & UpdateCommunicationTermsProps) => {
  const { dismissModal } = useAppModalStore();
  /* const [mainAuthDevice, setMainAuthDevice] = useState('');
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [confirmCode, setConfirmCode] = useState(''); */

  /* const initNewDevice = async () => {
    // Do API call for new device
    setMainAuthDevice(newAuthDevice);
    changePage?.(1, true);
  };

  const submitCode = async () => {
    // Do API call for submit code
    changePage?.(2, false);
  }; */

  const pages = [
    <ConfirmTermsSlide
      key={0}
      label="Confirm Changes"
      subLabel="Agree to the terms below and change your contact preferences."
      linkLabel="Cancel"
      checkboxLabel="By checking the box, I agree to enroll in email and/or mobile communication service as a member that is 18 or older, or as the legal guardian or personal representative of a member. I understand that communications via unencrypted internet and/or via text message are not secure and that there is a possibility that information included in email and/or text messages can be intercepted and read by other parties besides the person to whom it is addressed. By signing up, I accept the risks associated with emailing and text messaging and understand that message and data rates may apply. Further, by providing a phone number, I agree that BlueCross, its affiliates, and service providers may contact me using automated dialing systems."
      cancelCallback={() => dismissModal()}
      nextCallback={() => changePage?.(1, true)}
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
