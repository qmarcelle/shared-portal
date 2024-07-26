import { PingOneSession } from '@/app/(main)/login/models/app/pingone_session';
import { cookies } from 'next/headers';
import { UNIXTimeSeconds } from './date_formatter';

export async function setWebsphereRedirectCookie(
  interactionData: Partial<PingOneSession>,
): Promise<void> {
  if (process.env.NEXT_PUBLIC_WPS_REDIRECT_ENABLED == 'true') {
    const FED_MAX_AGE = parseInt(
      process.env.PING_FED_EXPIRY_SECONDS || '2592000',
    );
    const MAX_AGE = parseInt(process.env.PING_ONE_EXPIRY_SECONDS || '3600');
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
    const pingOneExpiryDate = new Date((UNIXTimeSeconds() + MAX_AGE) * 1000);
    const options = {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: pingOneExpiryDate,
    };
    cookies().set('interactionId', interactionData.interactionId, options);
    cookies().set(
      'interactionToken',
      interactionData.interactionToken,
      options,
    );

    cookies().set('ST', interactionData.sessionToken, {
      domain: '.bcbst.com',
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: `/${interactionData.sessionToken}`,
      maxAge: FED_MAX_AGE,
      expires: new Date((UNIXTimeSeconds() + FED_MAX_AGE) * 1000),
    });
  }
}
