'use server';

import { getMemberAndDependents } from '@/actions/memberDetails';
import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { FilterItem } from '@/models/filter_dropdown_details';
import { logger } from '@/utils/logger';

export async function getInitialMemberListFilter(): Promise<
  ActionResponse<number, FilterItem[]>
> {
  try {
    const session = await auth();
    //Get Members
    const result = await getMemberAndDependents(
      session!.user.currUsr!.plan!.memCk,
    );
    const filterItems: FilterItem[] = [
      {
        label: 'Member Name',
        type: 'dropdown',
        value: result.map((item, index) => ({
          label: item.name,
          value: item.name,
          id: index.toString(),
        })),
        selectedValue: {
          label: result[0].name,
          value: result[0].name,
          id: '0',
        },
      },
    ];
    return {
      status: 200,
      data: filterItems,
    };
  } catch (error) {
    console.error(error);
    logger.error('Get MemberData Failed : ', error);
    return {
      status: 400,
    };
  }
}
