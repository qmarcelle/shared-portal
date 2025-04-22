'use server';

import { getContactInfo } from '@/app/myPlan/actions/getAllPlansData';
import { AllMyPlanData, PlanDetail } from '@/app/myPlan/model/app/myPlanData';
import { auth } from '@/auth';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
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
    console.log('loggedUserInfo', loggedUserInfo);
    member.userId = session?.user.id ?? '';
    member.subscriberId = loggedUserInfo.subscriberID;
    member.subscriberCk = loggedUserInfo.subscriberCK;
    member.noOfDependents = loggedUserInfo.members.length;
    member.subscriberLoggedIn = loggedUserInfo.subscriberLoggedIn;
    member.lob = loggedUserInfo.lob;
    member.groupDetails = loggedUserInfo.groupData;
    member.networkPrefix = loggedUserInfo.networkPrefix;
    member.groupId = loggedUserInfo.groupData.groupID;
    member.groupEIN = loggedUserInfo.groupData.groupEIN;
    member.groupKey = loggedUserInfo.groupData.groupCK;
    member.groupName = loggedUserInfo.groupData.groupName;
    member.coverageTypes = loggedUserInfo.coverageTypes;
    member.lineOfBusiness = loggedUserInfo.lob;
    member.cmCondition = loggedUserInfo.cmcondition.join(',');
    const loggedMember = loggedUserInfo.members.find(
      (item) => item.memberCk.toString() === session!.user.currUsr!.plan!.memCk,
    );
    if (loggedMember) {
      member.firstName = loggedMember.firstName ?? '';
      member.middleIntital = loggedMember.middleInitial ?? '';
      member.lastName = loggedMember.lastName ?? '';
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

export const computeLoggedInUserName = (
  loggedUserInfo: LoggedInUserInfo,
  memCk: string,
): string[] => {
  const loggedInUserName: string[] = [];
  if (loggedUserInfo.subscriberLoggedIn) {
    loggedInUserName[0] = loggedUserInfo.subscriberFirstName;
    loggedInUserName[1] = loggedUserInfo.subscriberLastName;
  } else {
    const loggedInMember = loggedUserInfo.members.find(
      (item) => item.memberCk.toString() === memCk,
    );
    loggedInUserName[0] = loggedInMember?.firstName ?? '';
    loggedInUserName[1] = loggedInMember?.lastName ?? '';
  }
  return loggedInUserName;
};

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

export async function getMemberAndDependentsPlanDetails(
  sessionData?: Session | null,
): Promise<AllMyPlanData[]> {
  const session = sessionData ?? (await auth());
  const loggedInUser = await getLoggedInUserInfo(
    session?.user.currUsr?.plan!.memCk ?? '',
  );

  const categoryFlags: { [key: string]: string } = {
    M: 'isMedical',
    D: 'isDental',
    V: 'isVision',
    S: 'isSupplemental',
  };

  const contactInfo = await getContactInfo(session?.user.currUsr?.umpi ?? '');

  return loggedInUser.members.map((item) => {
    const memberName = `${item.firstName} ${item.lastName}`;

    const planDetails: PlanDetail[] = item.planDetails.map((plan) => {
      const planDetail: PlanDetail = {
        productCategory: plan.productCategory,
        planID: plan.planID,
        effectiveDate: plan.effectiveDate,
        planStartDate: plan.planStartDate,
        planClassID: plan.planClassID,
        networkPlanName: plan.networkPlanName,
        isMedical: false,
        isDental: false,
        isVision: false,
        isSupplemental: false,
      };

      const flag = categoryFlags[plan.productCategory];
      if (flag) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (planDetail as any)[flag] = true;
      }
      return planDetail;
    });

    const medicalPlan = planDetails.find((plan) => plan.isMedical);
    const dentalPlan = planDetails.find((plan) => plan.isDental);
    const visionPlan = planDetails.find((plan) => plan.isVision);
    return {
      memberName,
      dob: item.birthDate,
      planDetails,
      medicalEffectiveDate: medicalPlan
        ? new Date(medicalPlan.effectiveDate).toLocaleDateString()
        : '',
      dentalEffectiveDate: dentalPlan
        ? new Date(dentalPlan.effectiveDate).toLocaleDateString()
        : '',
      visionEffectiveDate: visionPlan
        ? new Date(visionPlan.effectiveDate).toLocaleDateString()
        : '',
      address: loggedInUser.addresses ? loggedInUser.addresses : [],
      primaryPhoneNumber: contactInfo.phone,
      secondaryPhoneNumber: 'N/A',
      age: Number(item.birthDate),
      mailAddressType: item.mailAddressType,
      memCk: item.memberCk.toString(),
    };
  });
}
