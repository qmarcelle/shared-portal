import { UpdateRowWithStatus } from '@/components/composite/UpdateRowWithStatus';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { LinkRow } from '@/components/foundation/LinkRow';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { EditEmailProfileSettings } from '../journeys/EditEmailProfileSettings';
import { UpdatePhoneNumberJourney } from '../journeys/UpdatePhoneNumberJourney';

/* eslint-disable */

interface ProfileInformationCardProps extends IComponent {
  name: string;
  DOB: string;
  phoneNumber: string;
  email: string;
}

export const ProfileInformationCard = ({
  name,
  DOB,
  email,
  phoneNumber,
}: ProfileInformationCardProps) => {
  const { showAppModal } = useAppModalStore();
  return (
    <Card className="large-section">
      <Column>
        <section>
          <Spacer size={16} />
          <Header type="title-2" text="Profile Information" />
          <Spacer size={16} />
          <section>
            <RichText
              spans={[
                <span>
                  Below is your profile information. The phone number and email
                  address below will be used for account security and some
                  communications. You can{' '}
                </span>,
                <span className="link">
                  <a>view your plan details here.</a>
                </span>,
              ]}
            />
          </section>
          <Spacer size={32} />
        </section>{' '}
        {/* Add Other Update Methods here */}
        <Card>
          <Column className="m-4">
            <TextBox className="font-bold body-1" text={name} />
            <Spacer size={8} />
            <TextBox className="body-1" text={'DOB: ' + DOB} />
          </Column>
        </Card>
        <Spacer size={32} />
        <UpdateRowWithStatus
          key={'Phone Number'}
          onClick={() =>
            showAppModal({
              content: <UpdatePhoneNumberJourney phoneNumber={phoneNumber} />,
            })
          }
          label={<TextBox className="font-bold" text="Phone Number" />}
          subLabel={phoneNumber}
          methodName="Update"
          divider={true}
          onOffLabelEnabled={false}
        />
        <Spacer size={16} />
        <UpdateRowWithStatus
          key={'Email'}
          onClick={() =>
            showAppModal({
              content: <EditEmailProfileSettings email={email} />,
            })
          }
          label={<TextBox className="font-bold" text="Email Address" />}
          subLabel={email}
          methodName="Update"
          divider={true}
          onOffLabelEnabled={false}
        />
        <Spacer size={16} />
        <Column>
          <LinkRow label="Other Profile Settings" />
          <TextBox
            className="ml-3"
            text="Add or update details about yourself, including ethnicity, race and language preferences."
          />
        </Column>
      </Column>
    </Card>
  );
};
