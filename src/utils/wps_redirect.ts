import { PingOneSession } from '@/app/(protected)/(common)/member/login/models/app/pingone_session';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { UNIXTimeSeconds } from './date_formatter';

export async function setWebsphereRedirectCookie(
  interactionData: Partial<PingOneSession>,
): Promise<void> {
  if (
    process.env.WPS_REDIRECT_ENABLED == 'true' ||
    process.env.SSO_OUTBOUND_ENABLED == 'true'
  ) {
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
    const pingOneOptions: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: true,
      maxAge: MAX_AGE,
      path: '/',
      expires: pingOneExpiryDate,
    };
    const pingFedOptions: Partial<ResponseCookie> = {
      domain: '.bcbst.com',
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: FED_MAX_AGE,
      expires: new Date((UNIXTimeSeconds() + FED_MAX_AGE) * 1000),
    };
    cookies().set(
      'interactionId',
      interactionData.interactionId,
      pingOneOptions,
    );
    cookies().set(
      'interactionToken',
      interactionData.interactionToken,
      pingOneOptions,
    );

    cookies().set('ST', interactionData.sessionToken, pingFedOptions);
    cookies().set('ST-NO-SS', interactionData.sessionToken, pingFedOptions);
  }
}
