import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
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
}

export const MembersRepresented = ({
  representativesData,
  isRepresentative,
  isRegistered,
  visibilityRules,
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
          {representativesData?.map((item, index) => (
            <MembersRepresentativeItem
              onRequestSuccessCallBack={() =>
                updateMemberInviteStateToPending(item.memeck!)
              }
              key={index}
              className="mb-4"
              memberName={item.memberName}
              memberMemeCk={item.memeck}
              requesteeFHRID={item.requesteeFHRID}
              DOB={item.DOB}
              isOnline={item.isOnline}
              fullAccess={item.fullAccess}
              isRepresentative={isRepresentative}
              visibilityRules={visibilityRules}
              inviteStatus={item.inviteStatus!}
            />
          ))}
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
