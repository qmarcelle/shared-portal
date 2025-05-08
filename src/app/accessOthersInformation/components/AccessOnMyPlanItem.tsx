import { InviteToRegister } from '@/app/accessOthersInformation/journeys/InviteToRegister';
import { RequestAccessOnMyPlan } from '@/app/accessOthersInformation/journeys/RequestAccessOnMyPlan';
import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { accessGranted, inboxIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';

interface AccessOnMyPlanItemProps extends IComponent {
  memberName: string;
  DOB: string;
  isOnline: boolean;
  icon?: JSX.Element;
  infoButton: boolean;
  icon1?: JSX.Element;
}

export const AccessOnMyPlanItem = ({
  memberName,
  DOB,
  isOnline,
  onClick,
  className,
  infoButton,
  icon = <Image src="/assets/edit.svg" alt="link" />,
  icon1 = <Image src={inboxIcon} alt="link" />,
}: AccessOnMyPlanItemProps) => {
  const { showAppModal } = useAppModalStore();
  function getProfileOfflineContent() {
    return (
      <Column>
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Card backgroundColor="rgba(0,0,0,0.05)">
            <Column className="m-4">
              <Row>
                <TextBox
                  className="body-1 "
                  text="This member has not created an online profile."
                />
              </Row>
              <AppLink
                label="Invite to Register"
                icon={icon1}
                callback={() =>
                  showAppModal({
                    content: <InviteToRegister memberName={memberName} />,
                  })
                }
              />
            </Column>
          </Card>
        </Row>
      </Column>
    );
  }

  function getProfileOnlineContent() {
    return (
      <Column>
        <Row>
          <Spacer axis="horizontal" size={8} />
          {infoButton && (
            <Row>
              <Image src={accessGranted} className="icon" alt="Info" />
              <TextBox className="pt-1 ml-1" text="Access Granted" />
            </Row>
          )}
        </Row>
        {!infoButton && (
          <div>
            {' '}
            <Spacer size={16} />
            <Row>
              <Spacer axis="horizontal" size={8} />
              <Title
                className="font-bold primary-color"
                text="Update"
                suffix={icon}
                callback={() =>
                  showAppModal({
                    content: <RequestAccessOnMyPlan memberName={memberName} />,
                  })
                }
              />
              <Spacer size={40} />
            </Row>
          </div>
        )}
      </Column>
    );
  }

  return (
    <Card
      className={`cursor-pointer ${className}`}
      type="elevated"
      onClick={onClick}
    >
      <Column className="m-4">
        <Spacer size={16} />
        <Row className="justify-between">
          <TextBox className="ml-2 font-bold body-1" text={memberName} />
          <TextBox text={'DOB: ' + DOB} />
        </Row>
        <Spacer size={16} />
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Divider />
        </Row>
        <Spacer size={16} />
        {isOnline ? getProfileOnlineContent() : getProfileOfflineContent()}
      </Column>
    </Card>
  );
};
