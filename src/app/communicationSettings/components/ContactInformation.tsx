import { UpdateCommunicationEmail } from '@/app/communicationSettings/journeys/UpdateCommunicationEmail';
import { UpdateCommunicationText } from '@/app/communicationSettings/journeys/UpdateCommunicationText';
import { IComponent } from '@/components/IComponent';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
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
        <TextBox text="We'll send alerts to the phone number and email below." />
        <Spacer size={24} />
        {phone && email ? (
          <Column>
            <UpdateCommunication
              key={'phone'}
              onClick={() =>
                showAppModal({
                  content: (
                    <UpdateCommunicationText initNumber="(123) 456-0000" />
                  ),
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
                  content: <UpdateCommunicationEmail email={email} />,
                })
              }
              label={<TextBox className="font-bold" text="Email Address" />}
              subLabel={email}
              methodName="Update"
              divider={false}
            />
          </Column>
        ) : (
          <ErrorInfoCard
            className="mt-4"
            errorText="We can't load your profile right now. Please try again later."
          />
        )}
      </>
    </Card>
  );
};
