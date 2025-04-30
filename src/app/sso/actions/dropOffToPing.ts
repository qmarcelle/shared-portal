'use server';
import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { logger } from '@/utils/logger';
import { challengeDropOffToPing } from '../actions/pingDropOff';

export default async function ssoDropOffToPing(
  ssoImpl: string,
): Promise<string> {
  console.log('ssoDropOffToPing !!!');

  const session = await auth();
  // const userName = session.user.id;
  const memberDetails = await getLoggedInMember(session);
  const handlerModule = await import(`../ssoImpl/${ssoImpl}`);
  console.log('SSO HANDLER ', handlerModule);
  console.log('SSO HANDLER Default ', handlerModule.default);
  const ssoParamMap: Map<string, string> =
    await handlerModule.default(memberDetails);
  console.log('SSO PARAM MAP DATA Is --', ssoParamMap);
  logger.info('TEST DATA MAP -- ', ssoParamMap);
  // Initiate Ping flow with myDataMap;

  // ping api call to get the referenceId
  const ref = await challengeDropOffToPing(ssoParamMap);
  console.log('ssoToPing -> REF :: ' + ref);

  if (ref == null || ref == undefined) {
    throw new Error('Ref Id is null');
  }

  // build the redirect url and do the redirect
  return ref;
}
