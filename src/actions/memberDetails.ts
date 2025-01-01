'use server';

import { auth } from '@/auth';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { Session } from 'next-auth';
import { MemberData, getLoggedInUserInfo } from './loggedUserInfo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMemberDetails() {
  //need to implement member service API call
  return memberMockResponse;
}

export async function getLoggedInMember(
  sessionData?: Session | null,
): Promise<LoggedInMember> {
  try {
    const member: LoggedInMember = {} as LoggedInMember;
    const session = sessionData ?? (await auth());
    const loggedUserInfo = await getLoggedInUserInfo(
      session?.user.currUsr?.plan.memCk ?? '',
    );
    member.subscriberId = loggedUserInfo.subscriberID;
    member.noOfDependents = loggedUserInfo.members.length;
    member.groupId = loggedUserInfo.groupData.groupID;
    member.cmCondition = loggedUserInfo.cmcondition.join(',');
    const loggedMember = loggedUserInfo.members.find(
      (x) => x.memRelation == 'M',
    );
    if (loggedMember) {
      member.firstName = loggedMember?.firstName ?? '';
      member.lastName = loggedMember?.lastName ?? '';
      member.dateOfBirth = loggedMember?.birthDate ?? '';
      member.suffix = loggedMember?.memberSuffix ?? 0;
      member.memRelation = loggedMember?.memRelation ?? '';
      const mailAddressType = loggedMember?.mailAddressType ?? '';
      if (mailAddressType) {
        for (const contact of loggedUserInfo.addresses) {
          if (mailAddressType == contact.type) {
            member.contact = contact;
          }
          if (contact.type == 'H') {
            member.homeAddress = contact;
          }
        }
      }
      member.planDetails = loggedMember?.planDetails ?? undefined;
      const todayInMillisec = new Date().getTime();
      if (member.planDetails != undefined) {
        member.futureEffective = false;
        for (const planDetails of member.planDetails) {
          if (planDetails.effectiveDate > todayInMillisec) {
            member.futureEffective = true;
            if (planDetails.productCategory == 'M')
              member.effectiveStartDate = new Date(
                planDetails.effectiveDate,
              ).toLocaleDateString();
            if (member.futureEffective && member.effectiveStartDate != null)
              break;
          }
        }
      }
    }
    return member;
  } catch (error) {
    console.error('LoggedInUserInfo API error', error);
    throw error;
  }
}

export async function getMemberAndDependents(
  memberCk: string,
): Promise<MemberData[]> {
  const loggedInUser = await getLoggedInUserInfo(memberCk);
  return loggedInUser.members.map((item) => {
    const name = `${item.firstName} ${item.lastName}`;
    return {
      id: name + item.memberCk.toString().slice(-2),
      name,
      memberCK: item.memberCk,
    };
  });
}
