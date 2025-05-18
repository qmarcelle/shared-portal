'use server';

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { PingPickUpResponse } from '../models/api/pickup_response';
import { submitInboundSSOChallenge } from './pingPickUp';

export const inboundSSO = async (
  refId: string | null,
  targetResource: string | null,
): Promise<PingPickUpResponse | undefined> => {
  console.log(`INBOUND SSO ${refId}`);
  let authUser = '';
  try {
    if (!refId) {
      throw 'Bad request!';
    }
    const pickupResponse = await submitInboundSSOChallenge(refId);
    if (pickupResponse.additionalProperties?.username) {
      authUser = pickupResponse.additionalProperties.username;
    } else {
      console.log('Failed to authenticate inbound SSO - no username');
      console.log(JSON.stringify(pickupResponse));
    }
    return pickupResponse;
  } catch (err) {
    console.log('Error authenticating inbound SSO');
    console.log(err);
  } finally {
    if (authUser) {
      await signIn('credentials', {
        userId: authUser,
        impersonator: null,
        redirect: false,
      });
      //The redirect to target resource on success is done client side by react router. Doing it server side broke stuff.
    } else {
      //Redirect to login if SSO failed. Preserve the target resource so deep links can still work
      redirect(
        targetResource
          ? `/login?TargetResource=${decodeURIComponent(targetResource)}`
          : '/login',
      );
    }
  }
};
