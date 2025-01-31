'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { PCA_MEME_CK, SSO_SUBJECT } from '../ssoConstants';

export default async function generatePCASSOMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generatePCASSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  ssoParamMap.set(PCA_MEME_CK, memberData.memeCk.toString());
  ssoParamMap.set(SSO_SUBJECT, memberData.memeCk.toString());

  console.log('generatePCASSOMap exited !!!');
  return ssoParamMap;
}
