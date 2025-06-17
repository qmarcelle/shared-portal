import { PingOneSession } from '@/app/login/models/app/pingone_session';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import 'server-only';
import { UNIXTimeSeconds } from './date_formatter';

const GENESYS_COOKIE_PREFIX = '_genesys.widgets.webchat';

export async function clearAllExternalCookies(): Promise<void> {
  cookies().set('ST', '', {
    domain: '.bcbst.com',
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'none',
  });
  cookies().set('ST-NO-SS', '', {
    domain: '.bcbst.com',
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'none',
  });
  cookies().delete('interactionId');
  cookies().delete('interactionToken');
  cookies().set('MPExternalSession', '', {
    domain: '.bcbst.com',
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'none',
  });
  await clearGenesysCookies();
}

export async function clearGenesysCookies(): Promise<void> {
  cookies()
    .getAll()
    .forEach((cookie) => {
      if (cookie.name.startsWith(GENESYS_COOKIE_PREFIX)) {
        cookies().set(cookie.name, '', {
          domain: '.bcbst.com',
        });
      }
    });
}

export async function setSTAndInteractionDataCookies(
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
