import { MemberData } from '@/actions/loggedUserInfo';
import { FilterItem } from '@/models/filter_dropdown_details';
import { defaultDateFilter } from '@/utils/filterUtils';
import 'server-only';

export const getInitialPriorAuthFilter = (memberList: MemberData[]) => {
  const memberFilters = [
    {
      label: 'All Members',
      value: '1',
      id: '1',
    },
    ...memberList.map((memberInfo, index) => {
      return {
        label: `${memberInfo?.firstName ?? ''} ${memberInfo?.lastName ?? ''}`,
        value: memberInfo.memberCK.toString(),
        id: (index + 2).toString(),
      };
    }),
  ];

  const filters: FilterItem[] = [
    {
      type: 'dropdown',
      label: 'Member',
      value: memberFilters,
      selectedValue: {
        label: 'All Members',
        value: '1',
        id: '1',
      },
    },
    {
      ...defaultDateFilter,
    },
  ];

  return filters;
};
