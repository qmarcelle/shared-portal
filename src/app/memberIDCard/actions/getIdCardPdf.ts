'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { formatDateToLocale } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';

export async function getIDCardPdf(
  effectiveDate: string = formatDateToLocale(new Date()),
): Promise<ActionResponse<number, string>> {
  try {
    const resp = await portalSvcsApi.get(
      `IDCardService/PDF?subscriberCk=949881000&groupId=119002&effectiveDate=${effectiveDate}`,
      {
        headers: {
          portaluser: 'm905699955',
          consumer: 'member',
        },
        responseType: 'arraybuffer',
      },
    );

    return {
      status: 200,
      data: Buffer.from(resp.data).toString('base64'),
    };
  } catch (err) {
    logger.error('Get ID Card Service error', err);
    console.error(err);
    return {
      status: 500,
      error: { message: 'ID Card Download Failed' },
    };
  }
}
