import { RequestAccessOnMyPlan } from '@/app/accessOthersInformation/journeys/RequestAccessOnMyPlan';
import { InviteToRegister } from '@/app/personalRepresentativeAccess/journeys/InviteToRegister';
import Image from 'next/image';
import editIcon from '../../../../public/assets/edit.svg';
import { IComponent } from '../../../components/IComponent';
import { AppLink } from '../../../components/foundation/AppLink';
import { useAppModalStore } from '../../../components/foundation/AppModal';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Divider } from '../../../components/foundation/Divider';
import { accessGranted, inboxIcon } from '../../../components/foundation/Icons';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';
import { Title } from '../../../components/foundation/Title';
import { EditLevelOfAccess } from '../journeys/EditLevelOfAccess';

interface MembersRepresentativeItemProps extends IComponent {
  memberName: string;
  DOB: string;
  isOnline: boolean;
  icon?: JSX.Element;
  fullAccess: boolean;
  icon1?: JSX.Element;
  isRepresentative?: boolean;
}

export const MembersRepresentativeItem = ({
  memberName,
  DOB,
  isOnline,
  onClick,
  className,
  fullAccess,
  isRepresentative,
  icon = <Image src={editIcon} alt="link" />,
  icon1 = <Image src={inboxIcon} alt="link" />,
}: MembersRepresentativeItemProps) => {
  // const [isPending, setIsPending] = useState(false);
  const { showAppModal } = useAppModalStore();
  function getProfileOfflineContent() {
    return (
      <Column>
        <Row>
          <Image src={accessGranted} className="icon" alt="Info" />
          <TextBox className="pt-1 ml-1" text="Basic Access as of 01/01/2024" />
          <Spacer axis="horizontal" size={32} />
        </Row>
        <Row>
          <Spacer axis="horizontal" size={16} />
          <Card backgroundColor="rgba(0,0,0,0.05)" className="w-full">
            <Column className="m-4">
              <Row className="mt-2">
                <TextBox
                  className="body-1"
                  text="This member has not created an online profile."
                />
              </Row>
              <Spacer axis="horizontal" size={8} />
              <AppLink
                className="!flex pl-0"
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
          {fullAccess && (
            <Row>
              <Image src={accessGranted} className="icon" alt="Info" />
              <TextBox className="pt-1 ml-1" text="Full Access" />
            </Row>
          )}
        </Row>
        {!fullAccess && (
          <div>
            {' '}
            <Row>
              <Image src={accessGranted} className="icon" alt="Info" />
              <TextBox
                className="pt-1 ml-1"
                text="Basic Access as of 01/01/2024"
              />
              <Spacer size={42} />
            </Row>
            {!isRepresentative && (
              <Row>
                <Spacer size={42} />
                <Title
                  className="font-bold primary-color"
                  text="Edit Access"
                  suffix={icon}
                  callback={() =>
                    showAppModal({
                      content: <EditLevelOfAccess memberName={memberName} />,
                    })
                  }
                />
              </Row>
            )}
            <Row>
              {isRepresentative && (
                <Title
                  className="font-bold primary-color"
                  text="Request Full Access"
                  suffix={icon}
                  callback={() =>
                    showAppModal({
                      content: (
                        <RequestAccessOnMyPlan memberName={memberName} />
                      ),
                    })
                  }
                />
              )}
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
