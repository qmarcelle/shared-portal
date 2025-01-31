'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import {
  SSO_CANCEL_URL,
  SSO_CONFIRM_URL,
  SSO_DEP_SEQ_NUMBER,
  SSO_GROUP_NUMBER,
  SSO_POLICY_NUMBER,
  SSO_SUBJECT,
  SSO_TARGET_RESOURCE,
  SSO_USER_ID,
  SSO_USER_NAME,
} from '../ssoConstants';

export default async function generateInstamedPaymentHistoryMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateInstamedPaymentHistoryMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

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
  ssoParamMap.set(SSO_SUBJECT, userId);
  ssoParamMap.set(
    SSO_TARGET_RESOURCE,
    process.env.INSTAMED_PAYMENT_HISTORY_SSO_TARGET ?? '',
  );

  console.log('generateInstamedPaymentHistoryMap exited !!!');
  return ssoParamMap;
}
