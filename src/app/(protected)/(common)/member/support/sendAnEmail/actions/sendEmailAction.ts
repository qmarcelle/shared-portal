'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { invokePhoneNumberAction } from '@/app/(protected)/(common)/member/profileSettings/actions/profileSettingsAction';
import { ActionResponse } from '@/models/app/actionResponse';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { EmailRequest, MemberDetails } from '../models/email_app_data';

export async function invokeFamilyMemberDetailsAction(
  memberCk: string,
): Promise<Array<MemberDetails>> {
  const loggedUserInfo = await getLoggedInUserInfo(memberCk);

  const membersInfo: MemberDetails[] = [];
  loggedUserInfo.members.forEach((item) => {
    if (item.memRelation == 'M') {
      membersInfo.push({
        fullName: 'Me',
        memberCK: item.memberCk + '',
      });
    } else {
      membersInfo.push({
        fullName: item.firstName + ' ' + item.lastName,
        memberCK: item.memberCk + '',
      });
    }
  });
  return membersInfo;
}

export async function invokeSendEmailAction(
  emailRequest: EmailRequest,
): Promise<ActionResponse<number, string>> {
  try {
    const loggedUserInfo = await getLoggedInUserInfo('memberCk');
    emailRequest.category = emailRequest.categoryValue == 'Dental' ? 'D' : 'M';
    emailRequest.groupID = loggedUserInfo.groupData.groupID;
    loggedUserInfo.members.forEach((item) => {
      if (item.memRelation == 'M') {
        emailRequest.name = item.firstName + ' ' + item.lastName;
        if (emailRequest.dependentName == 'Me') {
          emailRequest.dependentName = item.firstName + ' ' + item.lastName;
        }
        item.planDetails.forEach((plan) => {
          if (plan.productCategory == 'M') {
            emailRequest.planID = plan.planID;
          }
        });
      }
    });
    emailRequest.subscriberID = loggedUserInfo.subscriberCK;
    emailRequest.memberDOB = loggedUserInfo.subscriberDateOfBirth;
    loggedUserInfo.authFunctions.forEach((item) => {
      if (item.functionName == 'AMPLIFYMEMBER' && item.available) {
        emailRequest.amplifyHealth = item.available;
      }
    });
    emailRequest.contactNumber = await invokePhoneNumberAction();
    logger.info('emailRequest - ' + JSON.stringify(emailRequest));
    const resp = await memberService.post<string>(
      '/api/v1/contactusemail',
      emailRequest,
    );
    logger.info('EmailResponse - ' + JSON.stringify(resp.data));
    const emailMessage = JSON.stringify(resp.data);
    return {
      status: 200,
      data: emailMessage,
    };
  } catch (error) {
    logger.error('Send Email service error', error);
    return {
      status: 500,
      error: { message: 'Failure' },
    };
  }
}
