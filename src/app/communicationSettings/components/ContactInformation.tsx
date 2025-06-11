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
import { useState } from 'react';
import { ContactPreference } from '../models/app/communicationSettingsAppData';
import { UpdateCommunication } from './UpdateCommunication';
import { formatPhoneNumber } from '@/utils/inputValidator';

interface ContactInformationProps extends IComponent {
  phone: string;
  email: string;
  preferenceData: ContactPreference[];
}

export const ContactInformationSection = ({
  phone,
  email,
  className,
  preferenceData,
}: ContactInformationProps) => {
  const [emailAddress, setEmailAddress] = useState(email);
  const [phoneNumber, setphoneNumber] = useState(phone);
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
                    <UpdateCommunicationText
                      phone={phoneNumber}
                      email={emailAddress}
                      onRequestPhoneNoSuccessCallBack={(updatedPhoneNo) => {
                        setphoneNumber(updatedPhoneNo);
                      }}
                      preferenceData={preferenceData}
                    />
                  ),
                })
              }
              label={<TextBox className="font-bold" text="Phone Number" />}
              subLabel={formatPhoneNumber(phoneNumber)}
              methodName="Update"
              divider={true}
            />
            <Spacer size={24} />
            <UpdateCommunication
              key={'email'}
              onClick={() =>
                showAppModal({
                  content: (
                    <UpdateCommunicationEmail
                      email={emailAddress}
                      onRequestEmailSuccessCallBack={(updatedEmail) => {
                        setEmailAddress(updatedEmail);
                      }}
                    />
                  ),
                })
              }
              label={<TextBox className="font-bold" text="Email Address" />}
              subLabel={emailAddress}
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
