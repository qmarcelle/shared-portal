import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { AccessStatus } from '@/models/app/getSharePlanDetails';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { useState } from 'react';
import {
  InviteStatus,
  RepresentativeData,
} from '../models/representativeDetails';
import { MembersRepresentativeItem } from './MembersRepresentativeItem';

interface MembersRepresentedProps extends IComponent {
  representativesData: RepresentativeData[] | null;
  isRepresentative: boolean | undefined;
  isRegistered: boolean;
  visibilityRules?: VisibilityRules;
  allowUpdates?: boolean;
}

export const MembersRepresented = ({
  representativesData,
  isRepresentative,
  isRegistered,
  visibilityRules,
  allowUpdates = true,
}: MembersRepresentedProps) => {
  const [memberInviteState, setMemberInviteState] =
    useState(representativesData);
  function updateMemberInviteStateToPending(memberCk: string) {
    const member = memberInviteState?.find((item) => item.memeck === memberCk);

    if (member != undefined) {
      member.inviteStatus = InviteStatus.Pending;
      setMemberInviteState([...memberInviteState!]);
    }
  }

  const [memberAccessList, setMemberAccessList] = useState(representativesData);
  function updateMemberAccessToPending(memberCk: string) {
    const member = memberAccessList?.find((item) => item.memeck === memberCk);

    if (member != undefined) {
      member.accessStatusIsPending = true;
      setMemberAccessList([...memberAccessList!]);
    }
  }

  function representingMembers() {
    return (
      <Column className="flex flex-col">
        {isRepresentative && (
          <Header type="title-2" text="Members You Represent" />
        )}
        {!isRepresentative && (
          <Header type="title-2" text="Your Representative(s)" />
        )}
        <Spacer size={32} />
        <Column className="flex flex-col">
          {representativesData?.map(
            (item, index) =>
              item.accessStatus &&
              item.accessStatus !== AccessStatus.NoAccess && (
                <MembersRepresentativeItem
                  onRequestSuccessCallBack={() =>
                    updateMemberAccessToPending(item.memeck!)
                  }
                  onInviteSuccessCallBack={() =>
                    updateMemberInviteStateToPending(item.memeck!)
                  }
                  key={index}
                  className="mb-4"
                  memberMemeCk={item.memeck}
                  requesteeFHRID={item.requesteeFHRID}
                  requesteeUMPID={item.requesteeUMPID}
                  DOB={item.DOB}
                  isOnline={item.isOnline}
                  fullAccess={item.fullAccess}
                  isRepresentative={isRepresentative}
                  visibilityRules={visibilityRules}
                  allowUpdates={allowUpdates}
                  accessStatus={item.accessStatus!}
                  accessStatusIsPending={item.accessStatusIsPending!}
                  inviteStatus={item.inviteStatus!}
                  id={item.id}
                  policyId={item.policyId}
                  createdAt={item.createdAt}
                  memberRepresentativeData={item}
                />
              ),
          )}
        </Column>
        <Spacer size={12} />
        <Divider></Divider>
        <Spacer size={32} />
        {isRepresentative && (
          <RichText
            type="body-2"
            spans={[
              <span key={0}>
                if you have submitted a Personal Representative Authorization
                form, it might not yet appear on this page. For assistance,
                please
              </span>,
              <span className="link" key={1}>
                <a> start a chat </a>
              </span>,
              <span key={2}>or call us at [1-800-000-000]</span>,
            ]}
          />
        )}
        {!isRepresentative && (
          <RichText
            type="body-2"
            spans={[
              <span key={0}>For assistance, please</span>,
              <span className="link" key={1}>
                <a> start a chat </a>
              </span>,
              <span key={2}>or call us at [1-800-000-000]</span>,
            ]}
          />
        )}
      </Column>
    );
  }
  function membersNotRepresented() {
    return (
      <Column className="">
        <Card backgroundColor="rgba(0,0,0,0.05)">
          <TextBox
            className="p-4"
            text="We could not find connected personal representative access for your account."
          />
        </Card>
        <Spacer size={32} />
        <Divider></Divider>
        <Spacer size={32} />
        <RichText
          type="body-2"
          spans={[
            <span key={0}>
              if you have submitted a Personal Representative Authorization
              form, it might not yet appear on this page. For assistance, please
            </span>,
            <span className="link" key={1}>
              <a> start a chat </a>
            </span>,
            <span key={2}>or call us at [1-800-000-000]</span>,
          ]}
        />
      </Column>
    );
  }
  return (
    <div>{isRegistered ? representingMembers() : membersNotRepresented()}</div>
  );
};
