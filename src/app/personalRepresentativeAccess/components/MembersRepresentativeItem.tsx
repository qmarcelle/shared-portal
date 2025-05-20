import { InviteToRegister } from '@/app/personalRepresentativeAccess/journeys/InviteToRegister';
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
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import editIcon from '../../../../public/assets/edit.svg';
import { EditLevelOfAccess } from '../journeys/EditLevelOfAccess';
import { PersonalRepRequestAccessOnMyPlan } from '../journeys/PersonalRepRequestAccessOnMyPlan';
import { AccessStatus, InviteStatus } from '../models/representativeDetails';

interface MembersRepresentativeItemProps extends IComponent {
  inviteStatus: InviteStatus;
  accessStatus: AccessStatus;
  accessStatusIsPending: boolean;
  memberName: string;
  DOB: string;
  isOnline: boolean;
  isMatureMinor: boolean;
  icon?: JSX.Element;
  fullAccess: boolean;
  icon1?: JSX.Element;
  isRepresentative?: boolean;
  memberMemeCk?: string;
  requesteeFHRID?: string;
  requesteeUMPID?: string;
  visibilityRules?: VisibilityRules;
  id?: string;
  policyId?: string;
  expiresOn?: string;
  effectiveOn?: string;
  firstName?: string;
  lastName?: string;
  onRequestSuccessCallBack: () => void;
  onInviteSuccessCallBack: () => void;
  pendingIcon?: JSX.Element;
  allowUpdates?: boolean;
  createdAt?: string;
}

export const MembersRepresentativeItem = ({
  inviteStatus,
  accessStatus,
  accessStatusIsPending,
  onRequestSuccessCallBack,
  onInviteSuccessCallBack,
  memberName,
  DOB,
  isOnline = true,
  isMatureMinor,
  onClick,
  className,
  fullAccess,
  isRepresentative,
  memberMemeCk,
  requesteeFHRID,
  requesteeUMPID,
  id,
  policyId,
  expiresOn,
  effectiveOn,
  firstName,
  lastName,
  icon = <Image src={editIcon} alt="link" />,
  icon1 = <Image src={inboxIcon} alt="link" />,
  pendingIcon = <Image src={pendingLogo} alt="link" />,
  allowUpdates = true,
  createdAt,
}: MembersRepresentativeItemProps) => {
  const { showAppModal } = useAppModalStore();
  function getProfileOfflineContent() {
    return (
      <Column>
        <Row>
          <TextBox
            className="pt-1 ml-1"
            text={`${accessStatus} as of ${createdAt}`}
          />
          <Spacer axis="horizontal" size={32} />
        </Row>
        <Spacer size={16} />
        <Card backgroundColor="rgba(0,0,0,0.05)" className="w-full">
          <Column className="m-4">
            <Row className="mt-2">
              <TextBox
                className="body-1"
                text="This member has not created an online profile."
              />
            </Row>
            {inviteStatus != InviteStatus.Pending ? (
              <AppLink
                className="!flex pl-0"
                label="Invite to Register"
                icon={icon1}
                callback={() => {
                  showAppModal({
                    content: (
                      <InviteToRegister
                        isMaturedMinor={isMatureMinor}
                        memberName={memberName}
                        memeCk={memberMemeCk!}
                        requesteeFHRID={requesteeFHRID!}
                        onRequestSuccessCallBack={onInviteSuccessCallBack}
                      />
                    ),
                  });
                }}
              />
            ) : (
              <div className="flex flex-row">
                <div className="mr-2">{pendingIcon}</div>
                <p className={className}>Pending...</p>
              </div>
            )}
          </Column>
        </Card>
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
              <TextBox className="ml-2" text="Full Access" />
            </Row>
          )}
        </Row>
        {!fullAccess && (
          <div>
            <Row>
              <TextBox
                className="ml-2"
                text={`${accessStatus} as of ${createdAt}`}
              />
              <Spacer size={42} />
            </Row>
            {!isRepresentative && isMatureMinor && (
              <Row>
                <Spacer size={42} />
                <Title
                  className="font-bold primary-color ml-2"
                  text="Update"
                  suffix={icon}
                  callback={() => {
                    showAppModal({
                      content: (
                        <EditLevelOfAccess
                          memberName={memberName}
                          isMaturedMinor={isMatureMinor}
                          currentAccessType="basic"
                          disableSubmit={!allowUpdates}
                          id={id}
                          policyId={policyId}
                          expiresOn={expiresOn}
                          effectiveOn={effectiveOn}
                          firstName={firstName}
                          lastName={lastName}
                        />
                      ),
                    });
                  }}
                />
              </Row>
            )}
            {isRepresentative && (
              <Row>
                {!accessStatusIsPending ? (
                  <>
                    <Title
                      className="font-bold primary-color"
                      text="Request Full Access"
                      suffix={icon}
                      callback={() =>
                        showAppModal({
                          content: (
                            <PersonalRepRequestAccessOnMyPlan
                              memberName={memberName}
                              isMaturedMinor={isMatureMinor}
                              memeCk={memberMemeCk!}
                              requesteeFHRID={requesteeFHRID!}
                              requesteeUMPID={requesteeUMPID!}
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
                    <TextBox className="body-1 mb" text={accessStatus} />
                    <Spacer size={16} />
                    <div className="flex flex-row">
                      <div className="mr-2">{pendingIcon}</div>
                      <p className={className}>Pending...</p>
                    </div>
                  </>
                )}
              </Row>
            )}
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
      <Column className="m-8">
        <Spacer size={16} />
        <Row className="justify-between">
          <TextBox className="font-bold body-1" text={memberName} />
          <TextBox text={'DOB: ' + DOB} />
        </Row>
        <Spacer size={16} />
        <Divider />
        <Spacer size={16} />
        {isOnline ? getProfileOnlineContent() : getProfileOfflineContent()}
      </Column>
    </Card>
  );
};
