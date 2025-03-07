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
      session!.user.currUsr!.plan!.memCk,
    );
    member.userId = session?.user.id ?? '';
    member.subscriberId = loggedUserInfo.subscriberID;
    member.subscriberCk = loggedUserInfo.subscriberCK;
    member.noOfDependents = loggedUserInfo.members.length;
    member.lob = loggedUserInfo.lob;
    member.groupDetails = loggedUserInfo.groupData;
    member.networkPrefix = loggedUserInfo.networkPrefix;
    member.groupId = loggedUserInfo.groupData.groupID;
    member.groupEIN = loggedUserInfo.groupData.groupEIN;
    member.groupKey = loggedUserInfo.groupData.groupCK;
    member.lineOfBusiness = loggedUserInfo.lob;
    member.cmCondition = loggedUserInfo.cmcondition.join(',');
    const loggedMember = loggedUserInfo.members.find(
      (x) => x.memRelation == 'M',
    );
    if (loggedMember) {
      member.firstName = loggedMember?.firstName ?? '';
      member.middleIntital = loggedMember?.middleInitial ?? '';
      member.lastName = loggedMember?.lastName ?? '';
      member.dateOfBirth = loggedMember?.birthDate ?? '';
      member.suffix = loggedMember?.memberSuffix ?? 0;
      member.memRelation = loggedMember?.memRelation ?? '';
      member.memeCk = loggedMember?.memberCk;
      member.gender = loggedMember?.gender;
      member.ssn = loggedMember?.socialSecNum ?? '';
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
            if (planDetails.productCategory == 'M') {
              member.isMedical = true;
              member.effectiveStartDate = new Date(
                planDetails.effectiveDate,
              ).toLocaleDateString();
              member.mpdpdId = planDetails.planID;
            }
            if (planDetails.productCategory == 'D') {
              member.isDental = true;
              member.dpdpdId = planDetails.planID;
            }
            if (planDetails.productCategory == 'V') {
              member.isVision = true;
              member.vpdpdId = planDetails.planID;
            }
            if (planDetails.productCategory == 'S') {
              member.spdpdId = planDetails.planID;
            }
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
      firstName: item.firstName,
      lastName: item.lastName,
      suffix: item.memberSuffix,
      dob: item.birthDate,
    };
  });
}
