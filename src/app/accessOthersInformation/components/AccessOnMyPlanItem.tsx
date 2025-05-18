import { InviteToRegister } from '@/app/accessOthersInformation/journeys/InviteToRegister';
import { RequestAccessOnMyPlan } from '@/app/accessOthersInformation/journeys/RequestAccessOnMyPlan';
import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import {
  accessGranted,
  inboxIcon,
  pendingLogo,
} from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import {
  AccessStatus,
  ShareMyPlanDetails,
} from '@/models/app/getSharePlanDetails';
import { capitalizeName } from '@/utils/capitalizeName';
import Image from 'next/image';
import editIcon from '../../../../public/assets/edit.svg';

interface AccessOnMyPlanItemProps extends IComponent {
  inviteStatus: boolean;
  memberDetails: ShareMyPlanDetails;
  loggedInMemberType: string | null;
  onRequestSuccessCallBack: () => void;
  isOnline: boolean;
  icon?: JSX.Element;
  infoButton: boolean;
  icon1?: JSX.Element;
  pendingIcon?: JSX.Element;
  allowUpdates?: boolean;
}

export const AccessOnMyPlanItem = ({
  inviteStatus,
  onRequestSuccessCallBack,
  memberDetails,
  loggedInMemberType,
  isOnline,
  onClick,
  className,
  infoButton,
  icon = <Image src={editIcon} alt="link" />,
  icon1 = <Image src={inboxIcon} alt="link" />,
  pendingIcon = <Image src={pendingLogo} alt="link" />,
  allowUpdates = true,
}: AccessOnMyPlanItemProps) => {
  const { showAppModal } = useAppModalStore();
  function getProfileOfflineContent() {
    return (
      <Column>
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Card backgroundColor="rgba(0,0,0,0.05)">
            <Column className="m-4 ">
              <Row>
                <TextBox
                  className="body-1 "
                  text="This member has not created an online profile."
                />
              </Row>
              {!inviteStatus ? (
                <AppLink
                  className="!flex pl-0"
                  label="Invite to Register"
                  icon={icon1}
                  callback={() =>
                    showAppModal({
                      content: (
                        <InviteToRegister
                          memberDetails={memberDetails!}
                          onRequestSuccessCallBack={onRequestSuccessCallBack}
                        />
                      ),
                    })
                  }
                />
              ) : (
                <div className="flex flex-row">
                  <div className="mr-2">{pendingIcon}</div>
                  <p className={className}>Pending...</p>
                </div>
              )}
            </Column>
          </Card>
        </Row>
      </Column>
    );
  }

  function toDisplayEditIcon(
    memberDetails: ShareMyPlanDetails,
    loggedInMemberType: string | null,
  ) {
    if (
      loggedInMemberType != null &&
      loggedInMemberType.toLowerCase() === 'dependent'
    ) {
      if (memberDetails.isMinor) return false;
      else {
        if (memberDetails.accessStatus !== AccessStatus.FullAccess) return true;
        else return false;
      }
    } else {
      if (memberDetails.accessStatus !== AccessStatus.FullAccess) return true;
      else return false;
    }
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
            <Row>
              <Spacer axis="horizontal" size={8} />
              <section>
                {!memberDetails.accessStatusIsPending ? (
                  <>
                    <TextBox
                      className="body-1 mb"
                      text={memberDetails.accessStatus}
                    />
                    <Spacer size={16} />
                    <Title
                      className="font-bold primary-color"
                      text={
                        toDisplayEditIcon(memberDetails, loggedInMemberType)
                          ? 'Update'
                          : ''
                      }
                      suffix={
                        toDisplayEditIcon(memberDetails, loggedInMemberType)
                          ? icon
                          : undefined
                      }
                      callback={() =>
                        showAppModal({
                          content: (
                            <RequestAccessOnMyPlan
                              memberDetails={memberDetails}
                              disableSubmit={!allowUpdates}
                              onRequestSuccessCallBack={
                                onRequestSuccessCallBack
                              }
                            />
                          ),
                        })
                      }
                    />
                  </>
                ) : (
                  <>
                    <TextBox
                      className="body-1 mb"
                      text={memberDetails.accessStatus}
                    />
                    <Spacer size={16} />
                    <div className="flex flex-row">
                      <div className="mr-2">{pendingIcon}</div>
                      <p className={className}>Pending...</p>
                    </div>
                  </>
                )}
              </section>
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
          <TextBox
            className="ml-2 font-bold body-1"
            text={capitalizeName(memberDetails.memberName)}
          />
          <TextBox text={'DOB: ' + memberDetails.DOB} />
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
