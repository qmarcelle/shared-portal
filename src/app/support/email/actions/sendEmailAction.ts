'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getMemberDetails } from '@/actions/memberDetails';
import { esApi } from '@/utils/api/esApi';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { EmailRequest, MemberDetails } from '../models/emalAppData';

export async function invokeEmailAction(): Promise<string> {
  try {
    const memberDetails = await getMemberDetails();
    const emailResponse = await esApi.get(
      `/memberContactPreference?memberKey=${memberDetails.member_ck}&subscriberKey=${memberDetails.subscriber_ck}&getMemberPreferenceBy=memberKeySubscriberKey&memberUserId=${memberDetails.userID}&extendedOptions=true`,
    );
    if (emailResponse?.data?.data?.emailAddress != null) {
      return emailResponse?.data?.data?.emailAddress;
    } else {
      return 'no.email@no_email.com';
    }
  } catch (error) {
    logger.error('Error Response from  Email API', error);
    throw error;
  }
}

export async function invokePhoneNumberAction(): Promise<string> {
  try {
    const memberDetails = await getMemberDetails();
    const effectiveDetials = new Date().toLocaleDateString();

    const phoneNumberResponse = await portalSvcsApi.get(
      `/IDCardService/OperationHours?groupId=${memberDetails.groupID}&subscriberCk=${memberDetails.subscriber_ck}&effectiveDetials=${effectiveDetials}`,
    );
    if (phoneNumberResponse?.data.memberServicePhoneNumber != null) {
      return phoneNumberResponse?.data.memberServicePhoneNumber;
    } else {
      return '1-800-565-9140'; // Phone number fetched from Application Settings(MemberService_PhoneNumber);
    }
  } catch (error) {
    // Add addtional condition if member is Amplify Member then phone number from Application Settings(AHDefault_ServiceNumber which is  1-866-258-3267)
    return '1-800-565-9140'; // In case of error return default phone number
  }
}

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
): Promise<void> {
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
    console.log('Thimmappa=== Before call');
    console.log('Before call - ' + JSON.stringify(emailRequest));
    const resp = await portalSvcsApi.post<string>(
      '/memberservice/api/v1/contactusemail',
      emailRequest,
    );

    console.log('EmailRequest - ' + JSON.stringify(emailRequest));
    console.log('EmailResponse - ' + JSON.stringify(resp.data));
  } catch (error) {
    throw error;
  }
}
