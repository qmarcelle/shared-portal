import { PingOneSession } from '@/app/(main)/login/models/app/pingone_session';
import { cookies } from 'next/headers';
import { UNIXTimeSeconds } from './date_formatter';

const MAX_AGE = 3600;

export async function setWebsphereRedirectCookie(
  interactionData: Partial<PingOneSession>,
): Promise<void> {
  if (process.env.WPS_REDIRECT_ENABLED == 'true') {
    console.debug(
      `Set WPS redirect auth cookies ${JSON.stringify(interactionData)}`,
    );
    if (
      !interactionData.interactionId ||
      !interactionData.interactionToken ||
      !interactionData.sessionToken
    ) {
      throw 'Websphere redirect failed: Invalid session (Ping API response is probably missing something)';
    }
    const expiry = new Date((UNIXTimeSeconds() + MAX_AGE) * 1000);
    const options = {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: expiry,
    };
    cookies().set('ST', interactionData.sessionToken, options);
    cookies().set('interactionId', interactionData.interactionId, options);
    cookies().set(
      'interactionToken',
      interactionData.interactionToken,
      options,
    );
  }
}
