'use server';

import { MemberData } from '@/actions/loggedUserInfo';
import { getClaimDetails } from '@/app/claims/actions/getClaimsDetails';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { getMemberDetails } from '@/utils/member_utils';
import {
  SSO_AMOUNT_DUE,
  SSO_CANCEL_URL,
  SSO_CLAIM_NUMBER,
  SSO_CLAIM_REF_NUMBER,
  SSO_CONFIRM_URL,
  SSO_DEP_SEQ_NUMBER,
  SSO_GROUP_NUMBER,
  SSO_PATIENT_FIRST_NAME,
  SSO_PATIENT_ID,
  SSO_PATIENT_LAST_NAME,
  SSO_PATIENT_SERVICE_BEGIN_DATE,
  SSO_PATIENT_SERVICE_END_DATE,
  SSO_PAY_TO_PROVIDER_ADDRESS,
  SSO_PAY_TO_PROVIDER_CITY,
  SSO_PAY_TO_PROVIDER_NAME,
  SSO_PAY_TO_PROVIDER_STATE,
  SSO_PAY_TO_PROVIDER_ZIP,
  SSO_POLICY_NUMBER,
  SSO_PROVIDER_BILLING_TIN,
  SSO_RENDERING_PROVIDER,
  SSO_SUBJECT,
  SSO_TARGET_RESOURCE,
  SSO_USER_ID,
  SSO_USER_NAME,
} from '../ssoConstants';

export default async function generateInstamedSSOMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateInstamedSSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  //Need to get from RequestParam
  const claimId: string = '';
  const claimType: string = '';
  const claimDetails = await getClaimDetails(
    memberData.subscriberCk,
    claimId,
    claimType,
  );
  const claimMember: MemberData | undefined = await getMemberDetails(
    memberData.memeCk,
    claimDetails.memberCk,
  );

  const userId = memberData.userId;
  ssoParamMap.set(SSO_CANCEL_URL, process.env.INSTAMED_CANCEL_URL ?? '');
  ssoParamMap.set(SSO_CONFIRM_URL, process.env.INSTAMED_CONFIRM_URL ?? '');
  ssoParamMap.set(SSO_USER_ID, userId);
  ssoParamMap.set(SSO_USER_NAME, userId);
  ssoParamMap.set(SSO_POLICY_NUMBER, memberData.subscriberId);
  ssoParamMap.set(SSO_GROUP_NUMBER, memberData.groupId);
  ssoParamMap.set(
    SSO_DEP_SEQ_NUMBER,
    memberData.suffix.toString().padStart(2, '0'),
  );
  ssoParamMap.set(SSO_PATIENT_FIRST_NAME, claimMember?.firstName ?? '');
  ssoParamMap.set(SSO_PATIENT_LAST_NAME, claimMember?.lastName ?? '');
  ssoParamMap.set(SSO_CLAIM_NUMBER, claimDetails.claimId);
  ssoParamMap.set(
    SSO_PATIENT_SERVICE_BEGIN_DATE,
    formatDateString(
      claimDetails.claimHighServiceCalendarDate,
      'MM-dd-yyyy',
      'MM/dd/yyyy',
    ),
  );
  ssoParamMap.set(
    SSO_PATIENT_SERVICE_END_DATE,
    formatDateString(
      claimDetails.claimLowServiceCalendarDate,
      'MM-dd-yyyy',
      'MM/dd/yyyy',
    ),
  );
  ssoParamMap.set(SSO_CLAIM_REF_NUMBER, claimDetails.claimId);
  ssoParamMap.set(
    SSO_AMOUNT_DUE,
    (claimDetails.claimPatientOweAmt - claimDetails.vndAmtPaid).toFixed(2),
  );
  ssoParamMap.set(SSO_PROVIDER_BILLING_TIN, claimDetails.providerBillingTIN);
  ssoParamMap.set(SSO_PAY_TO_PROVIDER_NAME, claimDetails.providerName);
  ssoParamMap.set(SSO_RENDERING_PROVIDER, claimDetails.providerName);
  ssoParamMap.set(
    SSO_PAY_TO_PROVIDER_ADDRESS,
    claimDetails.payToProviderAddress1,
  );
  ssoParamMap.set(SSO_PAY_TO_PROVIDER_CITY, claimDetails.payToProviderCity);
  ssoParamMap.set(SSO_PAY_TO_PROVIDER_STATE, claimDetails.payToProviderState);
  ssoParamMap.set(SSO_PAY_TO_PROVIDER_ZIP, claimDetails.payToProviderZip);
  ssoParamMap.set(SSO_PATIENT_ID, claimDetails.patientAccNo);
  ssoParamMap.set(SSO_TARGET_RESOURCE, process.env.INSTAMED_SSO_TARGET ?? '');
  ssoParamMap.set(SSO_SUBJECT, userId);

  console.log('generateInstamedSSOMap exited !!!');
  return ssoParamMap;
}
