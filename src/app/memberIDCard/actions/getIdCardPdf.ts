'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { idCardService } from '@/utils/api/idCardService';
import { formatDateToLocale } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';

export async function getIDCardPdf(
  effectiveDate: string = formatDateToLocale(new Date()),
): Promise<ActionResponse<number, string>> {
  try {
    const session = await auth();
    const resp = await idCardService.get(
      `/PDF?subscriberCk=${session?.user.currUsr?.plan!.sbsbCk}&groupId=${session?.user.currUsr?.plan!.grpId}&effectiveDate=${effectiveDate}`,
      {
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
