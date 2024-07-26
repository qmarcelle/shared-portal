import { UpdateCommunicationEmail } from '@/app/(main)/communicationSettings/journeys/UpdateCommunicationEmail';
import { UpdateCommunicationText } from '@/app/(main)/communicationSettings/journeys/UpdateCommunicationText';
import { IComponent } from '../../../../components/IComponent';
import { useAppModalStore } from '../../../../components/foundation/AppModal';
import { Card } from '../../../../components/foundation/Card';
import { Header } from '../../../../components/foundation/Header';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';
import { UpdateCommunication } from './UpdateCommunication';

interface ContactInformationProps extends IComponent {
  phone: string;
  email: string;
}

export const ContactInformationSection = ({
  phone,
  email,
  className,
}: ContactInformationProps) => {
  const { showAppModal } = useAppModalStore();
  return (
    <Card className={className}>
      <>
        <Header text="Contact Information" type="title-2" />
        <Spacer size={12} />
        <TextBox text="We'll send updates to the phone number and email below." />
        <Spacer size={24} />
        <UpdateCommunication
          key={'phone'}
          onClick={() =>
            showAppModal({
              content: <UpdateCommunicationText initNumber="(123) 456-0000" />,
            })
          }
          label={<TextBox className="font-bold" text="Phone Number" />}
          subLabel={phone}
          methodName="Update"
          divider={true}
        />
        <Spacer size={24} />
        <UpdateCommunication
          key={'email'}
          onClick={() =>
            showAppModal({
              content: <UpdateCommunicationEmail email="chall111@gmail.com" />,
            })
          }
          label={<TextBox className="font-bold" text="Email Address" />}
          subLabel={email}
          methodName="Update"
          divider={false}
        />
      </>
    </Card>
  );
};
