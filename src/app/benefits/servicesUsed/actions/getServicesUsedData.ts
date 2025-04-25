'use server';

import { getMemberAndDependents } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ServicesUsedItem } from '@/models/app/servicesused_details';
import { formatCurrency } from '@/utils/currency_formatter';
import { logger } from '@/utils/logger';
import { ServicesUsedData } from '../models/app/servicesUsedData';
import { getMemberLimit } from './getMemberLimit';

export async function getServicesUsedData(): Promise<
  ActionResponse<number, ServicesUsedData>
> {
  try {
    const session = await auth();
    const members = await getMemberAndDependents(
      session!.user.currUsr!.plan!.memCk,
    );
    const memberLimitsResp = await getMemberLimit({
      memberId: session!.user.currUsr!.plan!.memCk,
      productTypes: 'M',
    });

    const memberLimits = [
      ...memberLimitsResp.listofLifeTimeLimitDetails,
      ...memberLimitsResp.listofOufOfPocketDetails,
      ...memberLimitsResp.listofServiceLimitDetails,
    ];

    const services: Map<string, ServicesUsedItem[]> = new Map();

    members.forEach((member) => {
      const memberServices = memberLimits.filter(
        (item) => item.memberCK == member.memberCK,
      );
      services.set(
        member.id,
        memberServices.map((item) => ({
          serviceName: item.serviceDesc,
          // This will not be used as the service name has this value
          limitAmount: item.isDollarLimit
            ? formatCurrency(item.maxAllowedAmount!)!
            : (item.maxAllowedVisits?.toString() ?? '--'),
          spentAmount: item.isDollarLimit
            ? (formatCurrency(item.metAmount!) ?? '--')
            : (item.usedVisits?.toString() ?? '--'),
        })),
      );
    });

    return {
      status: 200,
      data: {
        members: members.map((item) => ({ id: item.id, name: item.name })),
        services: services,
      },
    };
  } catch (err) {
    logger.error('Member Limit API Error', err);
    return { status: 500 };
  }
}
