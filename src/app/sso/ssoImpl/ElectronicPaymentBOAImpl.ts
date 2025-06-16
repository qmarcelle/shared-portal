'use server';

import {
  getPremiumPayInfo,
  PremiumPayResponse,
} from '@/actions/premiumPayInfo';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateToGiven, UNIXTimeSeconds } from '@/utils/date_formatter';
import { isEligible } from '@/utils/member_utils';
import {
  BOA_PARTNER_KEY,
  BOA_PARTNER_KEY_SIGNATURE,
  SSO_ACCOUNT_NUMBER,
  SSO_CURRENT_BALANCE,
  SSO_CURRENT_STATEMENT_BALANCE,
  SSO_FIRST_NAME,
  SSO_LAST_NAME,
  SSO_PARTNER_KEY,
  SSO_PARTNER_SESSION_ID,
  SSO_PARTNER_SIGNATURE_KEY,
  SSO_PAYMENT_DUE_DATE,
  SSO_SUBJECT,
  SSO_TIME_STAMP,
} from '../ssoConstants';

export default async function generateElectronicPaymentBOAMap(
  memberData: LoggedInMember,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generateElectronicPaymentBOAMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  const premiumPayResponse: PremiumPayResponse = await getPremiumPayInfo(
    memberData.memeCk.toString(),
  );
  let partnerKey = '';
  if (isEligible(memberData, 'COBRAELIGIBLE')) {
    partnerKey = BOA_PARTNER_KEY.get('cobra') ?? '';
  } else {
    partnerKey = BOA_PARTNER_KEY.get(memberData.groupId) ?? '';
  }
  const partnerSignatureKey = BOA_PARTNER_KEY_SIGNATURE.get(partnerKey) ?? ';';
  ssoParamMap.set(SSO_PARTNER_KEY, partnerKey);
  ssoParamMap.set(SSO_PARTNER_SIGNATURE_KEY, partnerSignatureKey);
  //To Do - Need to add session id
  ssoParamMap.set(
    SSO_PARTNER_SESSION_ID,
    Buffer.from(memberData.userId + UNIXTimeSeconds).toString('base64'),
  );
  ssoParamMap.set(
    SSO_TIME_STAMP,
    formatDateToGiven(
      undefined,
      '2-digit',
      '2-digit',
      'numeric',
      '2-digit',
      '2-digit',
      '2-digit',
    ).replace(/:/g, ''),
  );
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName);
  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName);
  ssoParamMap.set(SSO_CURRENT_BALANCE, premiumPayResponse.currentBalance);
  ssoParamMap.set(
    SSO_CURRENT_STATEMENT_BALANCE,
    premiumPayResponse.currentStmtBalance,
  );
  ssoParamMap.set(SSO_PAYMENT_DUE_DATE, premiumPayResponse.paymentDue);
  ssoParamMap.set(SSO_ACCOUNT_NUMBER, memberData.subscriberId);
  ssoParamMap.set(SSO_SUBJECT, memberData.userId);

  console.log('generateElectronicPaymentBOAMap exited !!!');
  return ssoParamMap;
}
