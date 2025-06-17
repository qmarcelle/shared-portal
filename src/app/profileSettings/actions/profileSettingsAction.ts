'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { esApi } from '@/utils/api/esApi';
import { idCardService } from '@/utils/api/idCardService';
import { logger } from '@/utils/logger';

export async function invokeEmailAction(): Promise<string> {
  try {
    const session = await auth();
    const emailResponse = await esApi.get(
      `/memberContactPreference?memberKey=${session?.user.currUsr?.plan!.memCk}&subscriberKey=${session?.user.currUsr?.plan!.sbsbCk}&getMemberPreferenceBy=memberKeySubscriberKey&extendedOptions=true`,
    );

    if (emailResponse?.data?.data?.emailAddress != null) {
      return emailResponse?.data?.data?.emailAddress;
    } else {
      return ''; // Error scenarios need to be handled in separate story
    }
  } catch (error) {
    logger.error('Error Response from  Email API', error);
    throw error;
  }
}

export async function invokePhoneNumberAction(): Promise<string> {
  try {
    const session = await auth();
    const memberDetails = await getLoggedInMember(session);
    console.log('before call' + memberDetails.groupId);
    const effectiveDate = new Date().toLocaleDateString(); // current date

    const phoneNumberResponse = await idCardService.get(
      `/OperationHours?groupId=${memberDetails.groupId}&subscriberCk=${session?.user.currUsr?.plan!.sbsbCk}&effectiveDate=${effectiveDate}`,
    );
    //console.log('Rohit' + phoneNumberResponse?.data.memberServicePhoneNumber);
    if (phoneNumberResponse?.data.memberServicePhoneNumber != null) {
      return phoneNumberResponse?.data.memberServicePhoneNumber;
    } else {
      return '1-800-565-9140'; // Phone number fetched from Application Settings(MemberService_PhoneNumber);
    }
  } catch (error) {
    logger.error('Error Response from  Phone number API', error);
    // Add additional condition if member is Amplify Member then phone number from Application Settings(AHDefault_ServiceNumber which is  1-866-258-3267)
    return '1-800-565-9140'; // In case of error return default phone number
  }
}

export async function getOperationHours(): Promise<{
  memberServicePhoneNumber: string;
  operationHours: string;
}> {
  try {
    const session = await auth();
    const memberDetails = await getLoggedInMember(session);
    console.log('before call' + memberDetails.groupId);
    const effectiveDate = new Date().toLocaleDateString(); // current date

    const phoneNumberResponse = await idCardService.get(
      `/OperationHours?groupId=${memberDetails.groupId}&subscriberCk=${session?.user.currUsr?.plan!.sbsbCk}&effectiveDate=${effectiveDate}`,
    );
    if (phoneNumberResponse?.data.memberServicePhoneNumber != null) {
      return {
        memberServicePhoneNumber:
          phoneNumberResponse?.data.memberServicePhoneNumber,
        operationHours: phoneNumberResponse?.data.operationHours,
      };
    } else {
      return {
        memberServicePhoneNumber: '1-800-565-9140',
        operationHours: 'M-F 8AM-6PM (EST)',
      }; // Phone number fetched from Application Settings(MemberService_PhoneNumber);
    }
  } catch (error) {
    logger.error('Error Response from  Phone number API', error);
    // Add additional condition if member is Amplify Member then phone number from Application Settings(AHDefault_ServiceNumber which is  1-866-258-3267)
    return {
      memberServicePhoneNumber: '1-800-565-9140',
      operationHours: 'M-F 8AM-6PM (EST)',
    }; // Phone number fetched from Application Settings(MemberService_PhoneNumber);
  }
}
