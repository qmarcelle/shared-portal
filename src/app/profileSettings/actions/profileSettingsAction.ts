'use server';

import { getMemberDetails } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { esApi } from '@/utils/api/esApi';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';

export async function invokeEmailAction(): Promise<string> {
  try {
    const session = await auth();
    const emailResponse = await esApi.get(
      `/memberContactPreference?memberKey=${session?.user.currUsr?.plan.memCk}&subscriberKey=${session?.user.currUsr?.plan.sbsbCk}&getMemberPreferenceBy=memberKeySubscriberKey&extendedOptions=true`,
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
    const memberDetails = await getMemberDetails();
    const effectiveDetials = new Date().toLocaleDateString(); // current date

    const phoneNumberResponse = await portalSvcsApi.get(
      `/IDCardService/OperationHours?groupId=${memberDetails.groupID}&subscriberCk=${memberDetails.subscriber_ck}&effectiveDetials=${effectiveDetials}`,
    );
    if (phoneNumberResponse?.data.memberServicePhoneNumber != null) {
      return phoneNumberResponse?.data.memberServicePhoneNumber;
    } else {
      return '1-800-565-9140'; // Phone number fetched from Application Settings(MemberService_PhoneNumber);
    }
  } catch (error) {
    logger.error('Error Response from  Phone number API', error);
    // Add addtional condition if member is Amplify Member then phone number from Application Settings(AHDefault_ServiceNumber which is  1-866-258-3267)
    return '1-800-565-9140'; // In case of error return default phone number
  }
}
