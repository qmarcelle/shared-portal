import { LoginInteractionData } from '@/app/login/models/app/login_interaction_data';
import { cookies } from 'next/headers';
import { UNIXTimeSeconds } from './date_formatter';

const MAX_AGE = 3600;

export function setWebsphereRedirectCookie(
  interactionData: Partial<LoginInteractionData>,
): void {
  if (process.env.WPS_REDIRECT_ENABLED == 'true') {
    if (!interactionData.interactionId || !interactionData.interactionToken) {
      throw 'Websphere redirect failed: Invalid interaction data!';
    }
    console.debug(
      `Set WPS redirect auth cookies ${interactionData.interactionId} ${interactionData.interactionToken}`,
    );
    const expiry = new Date((UNIXTimeSeconds() + MAX_AGE) * 1000);
    const options = {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: expiry,
    };
    cookies().set('interactionId', interactionData.interactionId, options);
    cookies().set(
      'interactionToken',
      interactionData.interactionToken,
      options,
    );
  }
}
